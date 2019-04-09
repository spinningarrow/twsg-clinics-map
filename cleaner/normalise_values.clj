#!/usr/bin/env clj

(require '[cheshire.core :refer [parse-string generate-string]]
         '[clojure.string :refer [capitalize]])

(defn normalise-closed
  [value]
  (let [string (str value)]
    (if-let [[_ match] (re-find #"(?i)\s*(closed)\s*" string)]
      (capitalize match)
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

(def in (-> *in*
            slurp
            (parse-string true)))

(print (->> in
            (map #(reduce my-reducer {} %1))
            generate-string))
