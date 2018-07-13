# TWSG Clinics Map

A map of all the panel clinics for TWSG.

## Web (`/public`)

### Develop

Note: The development tools require [Node.js][]; install it manually or use
[Nix][] to install. A `default.nix` and `.envrc` is included for [direnv][] and
`nix-shell` support.

1. Install the development tools (linting, code formatting and live server):

       npm install

2. Make sure that your text editor or toolchain supports [EditorConfig][],
   [ESLint][], and [Prettier][].

3. Develop locally by starting the live server:

       npm run start:dev

   Open `localhost:8080` in your browser for development (and not
   `127.0.0.1:8080` or something else) to get Google Maps to load properly.

## Cleaner (`/cleaner`)

1. Download (or copy from Dropbox) the Excel file containing the clinic details

2. Rename it accordingly (check the `Makefile`)

3. Run `env GEOCODING_API_KEY=your-key-here make`

[Node.js]: https://nodejs.org/en/
[Nix]: https://nixos.org/nix/
[direnv]: https://direnv.net/
[EditorConfig]: https://editorconfig.org/
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io/
