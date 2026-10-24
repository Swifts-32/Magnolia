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
      packages.${system}.default =
        let
          # 1. Fixed-output derivation to fetch and build native deps safely
          bunDeps = pkgs.stdenv.mkDerivation {
            pname = "magnolia-deps";
            version = "1.0.0";
            src = self;
            nativeBuildInputs = with pkgs; [
              bun
              nodejs
              python3
              gnumake
              gcc
              pkg-config
              udev.dev
            ];

            buildPhase = ''
              export HOME=$TMPDIR
              export BUN_INSTALL_CACHE_DIR=$out
              export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib:$LD_LIBRARY_PATH"

              # 1. Install dependencies without running lifecycle scripts
              bun install --frozen-lockfile --ignore-scripts --no-save

              # 2. Rewrite shebangs across node_modules to point to Bun
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true

              # 3. Compile native serialport bindings with explicit PATH and headers
              if [ -d "node_modules/@serialport/bindings-cpp" ]; then
                cd node_modules/@serialport/bindings-cpp
                export PATH="${pkgs.bun}/bin:${pkgs.nodejs}/bin:${pkgs.python3}/bin:${pkgs.gnumake}/bin:${pkgs.gcc}/bin:$PATH"
                npm_config_nodedir="${pkgs.nodejs}" node-gyp rebuild || true
                cd ../../
              fi
            '';

            outputHashMode = "recursive";
            outputHash = "sha256-450KQBzl2IzIUPVCvUgWvGO44y3rwoki662fD+tT8TI=";
          };
        in
        pkgs.stdenv.mkDerivation {
          pname = "magnolia";
          version = "1.0.0";
          src = self;

          nativeBuildInputs = with pkgs; [
            bun
            python3
            gnumake
            gcc
            pkg-config
            udev.dev
          ];

          buildPhase = ''
            export HOME=$TMPDIR
            export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib:$LD_LIBRARY_PATH"

            # Restore cached dependencies into a writable directory
            mkdir -p $TMPDIR/bun-cache
            cp -r ${bunDeps}/* $TMPDIR/bun-cache/
            export BUN_INSTALL_CACHE_DIR=$TMPDIR/bun-cache

            # Run install offline using cache WITHOUT re-triggering scripts
            bun install --offline --frozen-lockfile --ignore-scripts

            # Rewrite all shebangs in the build tree to point directly to Bun
            find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true

            # Run the build script natively under Bun's runtime engine
            bun run --bun build

            # Compile Express server and SvelteKit build into a single standalone binary
            bun build --compile server.js --outfile magnolia
          '';

          installPhase = ''
            mkdir -p $out/bin $out/share/magnolia

            # Copy the standalone binary to bin
            cp magnolia $out/bin/magnolia

            # Copy migration files, drizzle config, and node_modules (required for native serialport bindings at runtime)
            cp -r drizzle.config.ts src/lib/server/db/migrations node_modules $out/share/magnolia/
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
            enable = lib.mkEnableOption "magnolia WebApp";
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
                LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib";
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
