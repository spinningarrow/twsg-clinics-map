# TWSG Clinics Map [![Netlify Status](https://api.netlify.com/api/v1/badges/02f58585-c258-4982-a881-23a03a018e9b/deploy-status)](https://app.netlify.com/sites/twsgclinics/deploys)

A map of all the panel clinics for TWSG.

**Archived**: This project is archived since it is superseded by the offical app.

## Develop

This repo contains several sub-projects: 

- `/public`: the main web app
- `/cleaner`: to build the JSON file with the clinics data
- `/test`: end-to-end tests

To install dependencies of the sub-projects, use `nix-shell` from [Nix][]
(optionally with [direnv][]) or refer to the `default.nix` file in each project
to see which dependencies to install manually.

For specific instructions for each sub-project, see below.

## `/public`

1. Install the development tools (linting, code formatting and live server):

       npm install

2. Make sure that your text editor or toolchain supports [EditorConfig][],
   [ESLint][], and [Prettier][].

3. Develop locally by starting the live server:

       npm run start:dev

   Open `localhost:8080` in your browser for development (and not
   `127.0.0.1:8080` or something else) to get Google Maps to load properly.

## `/cleaner`

1. Download (or copy from Dropbox) the Excel file containing the clinic details

2. Rename it accordingly (check the `Makefile`)

3. Run `env GEOCODING_API_KEY=your-key-here make`

[Node.js]: https://nodejs.org/en/
[Nix]: https://nixos.org/nix/
[direnv]: https://direnv.net/
[EditorConfig]: https://editorconfig.org/
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io/
