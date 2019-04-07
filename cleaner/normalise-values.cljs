#!/usr/bin/env planck

(require '[planck.core :refer [slurp *in*]]
         '[clojure.string :refer [capitalize]])

(defn normalise-closed
  [value]
  (let [string (str value)]
    (if (re-find #"(?i)\s*closed\s*" string)
      (capitalize string)
      value)))

(defn normalise-24-hours
  [value]
  (let [string (str value)]
    (if (re-find #"(?i)\s*24 hours\s*" string)
      "24 Hours"
      value)))

(defn my-reducer
  [memo [k v]]
  (assoc memo k (-> v normalise-24-hours normalise-closed)))

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

(def in (-> *in*
            slurp
            json->clj))

(print (->> in
            (map #(reduce my-reducer {} %1))
            clj->json))
