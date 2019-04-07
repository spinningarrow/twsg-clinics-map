let pkgs = import <nixpkgs> {};

in pkgs.stdenv.mkDerivation rec {
  name = "twsg-clinics-cleaner";

  buildInputs = with pkgs; [
    clojure
    python36Packages.csvkit
    jq
  ];
}
