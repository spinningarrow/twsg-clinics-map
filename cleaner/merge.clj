#!/usr/bin/env clj

(require '[cheshire.core :refer [parse-string generate-string]])

(def data1 (-> *command-line-args*
               first
               slurp
               (parse-string true)))

(def data2 (-> *command-line-args*
               last
               slurp
               (parse-string true)))

(print (-> (for [x data1 y data2 :when (= (x :id) (y :id))] (merge x y))
           generate-string))
