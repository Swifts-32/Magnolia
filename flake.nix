{
  description = "Magnolia WebApp";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux"; # Change to "aarch64-darwin" if you develop on Apple Silicon
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          bun              # Package manager and runtime
          # nodejs_20        # Node runtime for your express server.js
          postgresql_16    # Local PostgreSQL binaries

          # --- Required for compiling native modules like serialport ---
          python3
          gnumake
          gcc
          pkg-config
          udev.dev         # Development headers for serialport / udev bindings
        ];

        shellHook = ''
          echo "Initializing Magnolia WebApp Development Environment..."

          # Set up local PostgreSQL data directory in the project folder
          export PGDATA="$PWD/.postgres"
          if [ ! -d "$PGDATA" ]; then
            echo "Initializing local PostgreSQL database..."
            initdb -D "$PGDATA" --auth=trust >/dev/null
          fi

          # Start PostgreSQL if it isn't already running
          if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            echo "Starting local PostgreSQL server..."
            pg_ctl -D "$PGDATA" -l "$PWD/.postgres/postgres.log" -o "-k $PWD/.postgres" start >/dev/null 2>&1
          fi

          # Ensure a default database exists matching your project needs
          createdb -h localhost postgres 2>/dev/null || true

          # Set local connection URL for development
          export DATABASE_URL="postgresql://postgres@localhost:5432/postgres?host=$PWD/.postgres"
          
          echo "Database ready! Run 'bun install' followed by 'bun run dev' or start your server."
        '';
      };
    };
}
