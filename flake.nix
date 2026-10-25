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
      packages = forEachSystem (
        system:
        let
          # Build the heavy frontend natively on x86_64 to avoid emulation bottlenecks
          hostPkgs = import nixpkgs { system = "x86_64-linux"; };
          # Target pkgs matches the system being built (x86 for laptop, aarch64 for Pi)
          pkgs = import nixpkgs { inherit system; };

          bunDeps = pkgs.stdenv.mkDerivation {
            pname = "magnolia-deps";
            version = "1.0.0";
            src = self;
            nativeBuildInputs = with pkgs; [ bun ];

            buildPhase = ''
              export HOME=$TMPDIR
              export BUN_INSTALL_CACHE_DIR=$out
              bun install --frozen-lockfile --ignore-scripts --no-save
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${pkgs.bun}/bin/bun|' {} + || true
            '';

            outputHashMode = "recursive";
            outputHash = "sha256-450KQBzl2IzIUPVCvUgWvGO44y3rwoki662fD+tT8TI=";
          };

          frontendBuild = hostPkgs.stdenv.mkDerivation {
            pname = "magnolia-frontend";
            version = "1.0.0";
            src = self;

            nativeBuildInputs = with hostPkgs; [
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
              export LD_LIBRARY_PATH="${hostPkgs.stdenv.cc.cc.lib}/lib:${hostPkgs.udev}/lib:$LD_LIBRARY_PATH"

              mkdir -p $TMPDIR/bun-cache
              cp -r ${bunDeps}/* $TMPDIR/bun-cache/
              export BUN_INSTALL_CACHE_DIR=$TMPDIR/bun-cache

              bun install --offline --frozen-lockfile --ignore-scripts
              find node_modules -type f -exec grep -q '#!/usr/bin/env' {} \; -exec sed -i '1s|.*|#!${hostPkgs.bun}/bin/bun|' {} + || true

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
              };

              serviceConfig = {
                Type = "simple";
                User = "postgres";
                WorkingDirectory = "${self.packages.${pkgs.stdenv.system}.default}/share/magnolia";
                ExecStartPre = "${pkgs.bun}/bin/bun x drizzle-kit push";
                ExecStart = "${pkgs.bun}/bin/bun server.js";
                Restart = "always";
              };
            };
          };
        };
    };
}
