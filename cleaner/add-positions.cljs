#!/usr/bin/env planck

(require '[planck.core :refer [slurp]])

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
      JSON.parse
      (js->clj :keywordize-keys true)
      :results
      first
      :geometry
      :location))

(defn address
  [{roadName :roadName block :blk postalCode :postalCode}]
  (str block " " roadName ", Singapore " postalCode))

(def data (-> "clean-data.json"
              slurp
              JSON.parse
              (js->clj :keywordize-keys true)))

(defn main
  []
  (-> (map #(update %1 :position (fn [] (position (address %1)))) data)
      clj->js
      JSON.stringify))

(print (main))
