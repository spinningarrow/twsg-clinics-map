#!/usr/bin/env planck --classpath ..

(ns cleaner.clean-numbers-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [cleaner.clean-numbers :refer [clean-number transform]]))

(deftest test-clean-number
  (testing "removes .0 from numeric string when present"
    (is (= "1" (clean-number "1.0")))
    (is (= "152" (clean-number "152.0")))
    (is (= "-5" (clean-number "-5.0")))
    (is (= "0" (clean-number "0.0"))))
  (testing "does not remove decimal when it is other than .0"
    (is (= "5.23" (clean-number "5.23")))
    (is (= "-5.123" (clean-number "-5.123")))
    (is (= "0.25" (clean-number "0.25"))))
  (testing "returns string as-is when it is not a number"
    (is (= "hello" (clean-number "hello")))
    (is (= "!@#" (clean-number "!@#")))))

(deftest test-transform
  (testing "cleans numbers for every map in the collection"
    (is (= [{:block "5"}] (transform [{:block "5.0"}])))
    (is (= [{:block "5" :tel "56781234"}] (transform [{:block "5.0" :tel "56781234.0"}])))
    (is (= [{:a "1.1"} {:b "hey"}] (transform [{:a "1.1"} {:b "hey"}])))))

(defn -main
  []
  (cljs.test/run-tests 'cleaner.clean-numbers-test))
