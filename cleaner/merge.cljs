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

(def data1 (-> *command-line-args*
               first
               slurp
               json->clj))

(def data2 (-> *command-line-args*
               last
               slurp
               json->clj))

(print (-> (for [x data1 y data2 :when (= (x :id) (y :id))] (merge x y))
           clj->json))
