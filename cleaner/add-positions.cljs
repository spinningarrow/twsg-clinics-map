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

(def api-endpoint (str "https://maps.googleapis.com/maps/api/geocode/json"
                       "?key=AIzaSyAn5Nt8e_rYahYmraxZSc5quaS0h4RfNwI"))

(defn api-endpoint-with-address
  [address]
  (let [encoded-address (js/encodeURI address)]
    (str api-endpoint "&address=" encoded-address)))

(defn position
  [address]
  (-> address
      api-endpoint-with-address
      slurp
      json->clj
      :results
      first
      :geometry
      :location))

(defn address
  [{roadName :roadName block :blk postalCode :postalCode}]
  (str block " " roadName ", Singapore " postalCode))

(def in (-> *in*
            slurp
            json->clj))

(print (-> (map #(update %1 :position (fn [] (position (address %1)))) in)
           clj->json))
