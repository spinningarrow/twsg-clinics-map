let pkgs = import <nixpkgs> {};

in pkgs.stdenv.mkDerivation rec {
  name = "twsgclinics-ui";

  buildInputs = with pkgs; [
    nodejs-10_x
  ];
}
