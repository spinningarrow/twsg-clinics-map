#!/usr/bin/env clj

(require '[cheshire.core :refer [parse-string generate-string]]
         '[clojure.string :refer [capitalize]])

(defn normalise-closed
  [value]
  (if-let [[_ match] (re-find #"(?i)\s*(closed)\s*" (str value))]
    (capitalize match)
    value))

(defn normalise-24-hours
  [value]
  (if (re-find #"(?i)\s*24 hours\s*" (str value))
    "24 Hours"
    value))

(defn transform-map
  [m]
  (zipmap (keys m)
          (map (comp normalise-closed normalise-24-hours) (vals m))))

(def in (-> *in*
            slurp
            (parse-string true)))

(print (->> in
            (map transform-map)
            generate-string))
