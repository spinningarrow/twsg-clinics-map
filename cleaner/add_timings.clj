#!/usr/bin/env clj

(require '[cheshire.core :refer [parse-string generate-string]]
         '[clojure.string :refer [includes? split]])

(def day-names ["mon" "tue" "wed" "thu" "fri"])

(def mon-fri-pattern #"(?is).+?:(?:[^:]+(?:am|pm))")
(def timing-pattern #"(?i)(\d{1,2})[.:](\d{2})(am|pm)")
(def days-pattern #"(?i)Mon|Tue|Wed|Thu|Fri")
(def day-range-pattern #"(?i)(mon|tue|wed|thu|fri) - (mon|tue|wed|thu|fri)")

(defn hours
  [hh meridiem]
  (let [hh-int (mod (Integer/parseInt hh) 12)]
    (if (= "pm" meridiem)
      (+ hh-int 12)
      hh-int)))

(defn minutes
  [mm]
  (Integer/parseInt mm))

(defn timing
  "8.30am -> 830"
  [timing-string]
  (when-let [[_ hh mm meridiem] (re-find timing-pattern timing-string)]
    (+ (minutes mm) (* (hours hh (.toLowerCase meridiem)) 100))))

(defn timing-string-intervals
  "'8.30am - 10.00am, 10.30am - 12pm' -> [[8.30am 10.00am] [10.30am 12pm]]"
  [intervals-string]
  (if (includes? intervals-string "24 H")
    [["12.00am" "11.59pm"]]
    (map #(split %1 #"-") (split intervals-string #","))))

(defn timing-intervals
  "[[8.30am 10.00am]] -> [[830 1000]]"
  [intervals-string]
  (for [interval (timing-string-intervals intervals-string)]
    (map timing interval)))

(defn explode-day-range
  "tue-thu -> [tue wed thu]"
  [day-range]
  (if-let [[_ start-day end-day] (re-find day-range-pattern day-range)]
    (subvec day-names (.indexOf day-names start-day) (inc (.indexOf day-names end-day)))
    day-range))

(defn mon-fri-item-intervals
  [mon-fri-item-string]
  (let [[days-or-day-range intervals-string] (split mon-fri-item-string #":")
        days (explode-day-range days-or-day-range)
        result (timing-intervals intervals-string)]
    (map (fn [day] (when (includes? days day) result)) day-names)))

(defn mon-fri-timing-intervals
  [mon-fri-string]
  (if-not (re-find days-pattern mon-fri-string)
    (repeat 5 (timing-intervals mon-fri-string))
    (let [mon-fri-item-strings (re-seq mon-fri-pattern mon-fri-string)
          x (map mon-fri-item-intervals mon-fri-item-strings)]
      (apply map (fn [& args] (first (drop-while nil? args))) x))))

(defn clinic->timings
  [{monFri :monFri
    sun :sun
    sat :sat
    publicHolidays :publicHolidays}]
  {:days (concat [(timing-intervals sun)]
                 (mon-fri-timing-intervals (.toLowerCase monFri))
                 [(timing-intervals sat)])
   :publicHolidays (timing-intervals publicHolidays)})

(defn add-timings
  [clinic]
  (assoc clinic :timings (clinic->timings clinic)))

(def in (-> *in*
            slurp
            (parse-string true)))

(print (->> in
            (map add-timings)
            generate-string))
