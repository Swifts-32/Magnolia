{
  description = "Magnolia WebApp";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs, ... }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forEachSystem = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forEachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
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

              echo "Database ready! Run 'bun install' followed by 'bun run dev' or start your server."
            '';
          };
        }
      );

      packages = forEachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };

          # Filtered fileset for dependencies
          depFileset = nixpkgs.lib.fileset.toSource {
            root = ./.;
            fileset = nixpkgs.lib.fileset.unions [
              ./package.json
              ./bun.lock
            ];
          };

          # Filtered fileset for frontend build
          frontendFileset = nixpkgs.lib.fileset.toSource {
            root = ./.;
            fileset = nixpkgs.lib.fileset.unions [
              ./package.json
              ./bun.lock
              ./src
              ./vite.config.ts
              ./tsconfig.json
              ./server.js
              ./tailwind.config.js
              ./postcss.config.js
            ];
          };

          # System-specific dependencies (supports both x86_64 and aarch64 natively)
          bunDeps = pkgs.stdenv.mkDerivation {
            pname = "magnolia-deps-${system}";
            version = "1.0.0";
            src = depFileset;
            nativeBuildInputs = with pkgs; [ bun ];

            buildPhase = ''
              export HOME=$TMPDIR
              export BUN_INSTALL_CACHE_DIR=$out
              bun install --frozen-lockfile --ignore-scripts --no-save
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true
            '';

            outputHashMode = "recursive";
            outputHash =
              if system == "x86_64-linux" then
                "sha256-450KQBzl2IzIUPVCvUgWvGO44y3rwoki662fD+tT8TI="
              else
                "sha256-6OHw996pFrVANwGzWWLJo0nG63qFd3BCTl+wnLRyGxg=";
          };

          frontendBuild = pkgs.stdenv.mkDerivation {
            pname = "magnolia-frontend";
            version = "1.0.0";
            src = frontendFileset;

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
              export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib:$LD_LIBRARY_PATH"

              mkdir -p $TMPDIR/bun-cache
              cp -r ${bunDeps}/* $TMPDIR/bun-cache/
              export BUN_INSTALL_CACHE_DIR=$TMPDIR/bun-cache

              bun install --offline --frozen-lockfile --ignore-scripts
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true

              bun run --bun build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r build $out/build
            '';
          };
        in
        {
          default = pkgs.stdenv.mkDerivation {
            pname = "magnolia";
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
              export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.udev}/lib:$LD_LIBRARY_PATH"

              mkdir -p $TMPDIR/bun-cache
              cp -r ${bunDeps}/* $TMPDIR/bun-cache/
              export BUN_INSTALL_CACHE_DIR=$TMPDIR/bun-cache

              bun install --offline --frozen-lockfile --ignore-scripts
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true

              # Inject the lightning-fast x86-built frontend assets
              rm -rf build
              cp -r ${frontendBuild}/build build

              # Compile native serialport bindings for the target architecture
              if [ -d "node_modules/@serialport/bindings-cpp" ]; then
                (
                  cd node_modules/@serialport/bindings-cpp
                  export PATH="${pkgs.bun}/bin:${pkgs.nodejs}/bin:${pkgs.python3}/bin:${pkgs.gnumake}/bin:${pkgs.gcc}/bin:$PATH"
                  npm_config_nodedir="${pkgs.nodejs}" bun x node-gyp rebuild || true
                )
              fi
            '';

            installPhase = ''
              mkdir -p $out/share/magnolia
              cp -r server.js build drizzle.config.ts src node_modules package.json $out/share/magnolia/
            '';
          };
        }
      );

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
                PROTOCOL_HEADER = "x-forwarded-proto";
                HOST_HEADER = "x-forwarded-host";
              };

              serviceConfig = {
                Type = "simple";
                User = "postgres";
                WorkingDirectory = "${self.packages.${pkgs.stdenv.system}.default}/share/magnolia";
                ExecStartPre = "${pkgs.bun}/bin/bun x drizzle-kit push --force";
                ExecStart = "${pkgs.bun}/bin/bun server.js";
                Restart = "always";
              };
            };
          };
        };
    };
}
