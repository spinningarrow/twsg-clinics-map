let pkgs = import <nixpkgs> {};

in pkgs.stdenv.mkDerivation rec {
  name = "twsg-clinics-test";

  buildInputs = with pkgs; [
    nodejs-9_x
  ];
}
