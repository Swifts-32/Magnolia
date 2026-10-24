{
  description = "Magnolia WebApp";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      # 1. Development Shell (What you use locally)
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          bun
          postgresql_16
          python3
          gnumake
          gcc
          pkg-config
          udev.dev
        ];

        shellHook = ''
          echo "Initializing Magnolia WebApp Development Environment..."

          export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib:$LD_LIBRARY_PATH"

          export PGDATA="$PWD/.postgres"
          if [ ! -d "$PGDATA" ]; then
            echo "Initializing local PostgreSQL database..."
            initdb -D "$PGDATA" --auth=trust >/dev/null
          fi

          if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            echo "Starting local PostgreSQL server..."
            pg_ctl -D "$PGDATA" -l "$PWD/.postgres/postgres.log" -o "-k $PWD/.postgres" start >/dev/null 2>&1
          fi

          psql -h localhost -p 5432 -d template1 -c "CREATE ROLE postgres WITH LOGIN SUPERUSER;" 2>/dev/null || true
          createdb -h localhost postgres 2>/dev/null || true

          export DATABASE_URL="postgresql://postgres@localhost:5432/postgres?host=$PWD/.postgres"

          echo "Database ready! Run 'bun install' followed by 'bun run dev' or start your server."
        '';
      };

      # 2. Production Package (How Nix builds your app from source)
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        pname = "magnolia";
        version = "1.0.0";
        src = self;

        nativeBuildInputs = [
          pkgs.bun
          pkgs.nodejs
        ];

        buildPhase = ''
          export HOME=$TMPDIR
          bun install --frozen-lockfile || bun install
          bun run build
        '';

        installPhase = ''
          mkdir -p $out/share/magnolia
          cp -r build server.js package.json drizzle-config.ts node_modules src $out/share/magnolia/
        '';
      };

      # 3. NixOS Module (How your server deploys, migrates, and runs it)
      nixosModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        {
          options.services.magnolia = {
            enable = lib.mkEnableOption "Magnolia WebApp";
            origin = lib.mkOption {
              type = lib.types.str;
              default = "http://localhost:8080";
              description = "Public origin URL for SvelteKit CSRF enforcement";
            };
          };

          config = lib.mkIf config.services.magnolia.enable {
            services.postgresql = {
              enable = true;
              ensureDatabases = [ "magnolia" ];
              ensureUsers = [ { name = "postgres"; } ];
            };

            systemd.services.magnolia = {
              description = "Magnolia Train Management App";
              after = [
                "network.target"
                "postgresql.service"
              ];
              requires = [ "postgresql.service" ];
              wantedBy = [ "multi-user.target" ];

              environment = {
                PORT = "8080";
                ORIGIN = config.services.magnolia.origin;
                DATABASE_URL = "postgresql://postgres@localhost:5432/magnolia?host=/var/run/postgresql";
              };

              serviceConfig = {
                Type = "simple";
                User = "postgres";
                WorkingDirectory = "${self.packages.${system}.default}/share/magnolia";
                ExecStartPre = "${pkgs.bun}/bin/bun x drizzle-kit migrate";
                ExecStart = "${pkgs.bun}/bin/bun run server.js";
                Restart = "always";
              };
            };
          };
        };
    };
}
