#!/usr/bin/env planck --classpath ..

(ns cleaner.clean-numbers
  (:require [planck.core :refer [slurp *in*]]))

(defn json->clj
  [json]
  (-> json
      JSON.parse
      (js->clj :keywordize-keys true)))

(defn clj->json
  [clj]
  (-> clj
      clj->js
      JSON.stringify))

(defn clean-number
  [string]
  (let [number (js/parseInt string)]
    (if (= (.toFixed number 1) string)
      (str number)
      string)))

(defn my-reducer
  [memo [k v]]
  (assoc memo k (clean-number v)))

(defn map-values
  [f]
  (fn [m]
    (reduce-kv #(assoc %1 %2 (f %3)) {} m)))

(defn transform
  [in]
  (map (map-values clean-number) in))

(defn -main
  []
  (let [in (-> *in* slurp json->clj)]
    (-> in
        transform
        clj->json
        print)))

(set! *main-cli-fn* -main)
