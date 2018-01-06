#!/usr/bin/env planck

(require '[planck.core :refer [slurp *in*]])

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

(defn my-mapper
  [v]
  v)

(defn my-reducer
  [memo [k v]]
  (assoc memo k (clean-number v)))

(def in (-> *in*
            slurp
            json->clj))

(print (->> in
            (map #(reduce my-reducer {} %1))
            clj->json))
