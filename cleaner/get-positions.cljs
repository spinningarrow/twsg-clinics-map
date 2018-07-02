#!/usr/bin/env planck

(require '[planck.core :refer [slurp *in*]]
         '[planck.shell :refer [sh]])

(defn read-env
  [key]
  {:post [(not (nil? %))]}
  (->> (sh "env")
      :out
      (re-find (re-pattern (str key "=(.+)\n")))
      second))

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

(def api-endpoint (str "https://maps.googleapis.com/maps/api/geocode/json"
                       "?key="
                       (read-env "GEOCODING_API_KEY")))

(defn api-endpoint-with-address
  [address]
  (let [encoded-address (js/encodeURI address)]
    (str api-endpoint "&address=" encoded-address)))

(defn position
  [address]
  (.error js/console "INFO: Getting position for" address)
  (-> address
      api-endpoint-with-address
      slurp
      json->clj
      :results
      first
      :geometry
      :location))

(defn address
  [{roadName :roadName block :blk postalCode :postalCode zone :zone}]
  (let [country (if (re-find #"(?i)malaysia" zone) "Malaysia" "Singapore")]
    (str block " " roadName ", " country " " postalCode)))

(def in (-> *in*
            slurp
            json->clj))

(print (->> in
            (map (fn [clinic] {:id (clinic :id)
                               :position (position (address clinic))}))
            clj->json))
