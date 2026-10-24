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
      # 1. Development Shell
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
            initdb -D "$PGDATA" --auth=trust >/dev/null
          fi
          if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            pg_ctl -D "$PGDATA" -l "$PWD/.postgres/postgres.log" -o "-k $PWD/.postgres" start >/dev/null 2>&1
          fi
          psql -h localhost -p 5432 -d template1 -c "CREATE ROLE postgres WITH LOGIN SUPERUSER;" 2>/dev/null || true
          createdb -h localhost postgres 2>/dev/null || true
          export DATABASE_URL="postgresql://postgres@localhost:5432/postgres?host=$PWD/.postgres"
        '';
      };

      # 2. Production Package using Bun Standalone Compilation
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

          # Install dependencies (runs on your machine or if cache is present)
          bun install --frozen-lockfile

          # Build the SvelteKit frontend/server build output
          bun run build

          # Compile Express server and SvelteKit build into a single standalone binary
          bun build --compile server.js --outfile magnolia
        '';

        installPhase = ''
          mkdir -p $out/bin $out/share/magnolia

          # Copy the standalone binary to bin
          cp magnolia $out/bin/magnolia

          # Copy migration files and drizzle config needed at runtime
          cp -r drizzle-config.ts src/lib/server/db/migrations $out/share/magnolia/
        '';
      };

      # 3. NixOS Module
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

                # Run database migrations using drizzle-kit via bunx
                ExecStartPre = "${pkgs.bun}/bin/bun x drizzle-kit migrate";

                # Run the compiled standalone binary directly
                ExecStart = "${self.packages.${system}.default}/bin/magnolia";

                Restart = "always";
              };
            };
          };
        };
    };
}
