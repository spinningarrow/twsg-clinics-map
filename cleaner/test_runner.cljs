(ns cleaner.test-runner
  (:require [cljs.test :refer [run-all-tests]]
            [cleaner.clean-numbers-test]))

(defmethod cljs.test/report [:cljs.test/default :end-run-tests] [m]
  (if (cljs.test/successful? m)
    (println "Success!")
    (println "FAIL")))

(run-all-tests #"cleaner.*")

