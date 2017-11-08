#!/usr/bin/env planck

(require '[planck.core :refer [slurp]])
(require '[clojure.string :refer [split replace]])
(require '[clojure.set :refer [rename-keys]])

(defn capitalise
  [word]
  (replace word #"^." #(.toUpperCase %1)))

(defn remove-special-chars
  [word]
  (replace word #"\W" ""))

(defn camelise
  [string-with-spaces]
  (let [[first-word & rest-words] (split string-with-spaces #"\s+")
        capitalised-words (map capitalise rest-words)]
    (str first-word (apply str capitalised-words))))

(defn normalised-key
  [k]
  (-> k
      .toLowerCase
      camelise
      remove-special-chars))

(defn normalised-keys-map
  [ks]
  (reduce #(assoc %1 %2 (normalised-key %2)) {} ks))

(defn normalised-keys
  [m]
  (let [keymap (normalised-keys-map (keys m))]
    (rename-keys m keymap)))

(def data (-> "data.json"
              slurp
              JSON.parse
              js->clj))

(print (-> (map normalised-keys data)
           clj->js
           JSON.stringify))
