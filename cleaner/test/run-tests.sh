#!/usr/bin/env bash

test_clean_numbers() {
	actual="$(echo '[{ "x": "1234.0" }]' | ../clean-numbers.cljs | jq)"
	expected=$(echo '[{ "x": "1234" }]' | jq)

	assertEquals "$expected" "$actual"
}

test_merge() {
	data1='[{ "id": 1, "x": 2 }]'
	data2='[{ "id": 1, "y": 3 }]'

	actual="$(../merge.cljs <(echo "$data1") <(echo "$data2") | jq)"
	expected=$(echo '[{ "id": 1, "x": 2, "y": 3 }]' | jq)

	assertEquals "$expected" "$actual"
}

test_add_timings_when_text_is_lowercase() {
	input='[{
		"id": 1,
		"publicHolidays": "7.00am - 3.00pm,\n6.00pm - 12.00am",
		"sat": "7.30am - 1.00pm,\\n6.00pm - 12.00am",
		"monFri": "6.00am - 1.00pm,\\n5.00pm - 12.00am",
		"sun": "7.00am - 1.00pm,\\n6.00pm - 12.00am"
	}]'

	actual="$(echo $input | ../add-timings.cljs)"

	assertEquals 'sunday' '[[700,1300],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.days[0])"
	assertEquals 'monday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[1])"
	assertEquals 'tuesday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[2])"
	assertEquals 'wednesday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[3])"
	assertEquals 'thursday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[4])"
	assertEquals 'friday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[5])"
	assertEquals 'saturday' '[[730,1300],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.days[6])"
	assertEquals 'public holidays' '[[700,1500],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.publicHolidays)"
}

test_add_timings_when_text_is_uppercase() {
	input='[{
		"id": 1,
		"publicHolidays": "7.00AM - 3.00PM,\n6.00PM - 12.00AM",
		"sat": "7.30AM - 1.00PM,\\n6.00PM - 12.00AM",
		"monFri": "6.00AM - 1.00PM,\\n5.00PM - 12.00AM",
		"sun": "7.00AM - 1.00PM,\\n6.00PM - 12.00AM"
	}]'

	actual="$(echo $input | ../add-timings.cljs)"

	assertEquals 'sunday' '[[700,1300],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.days[0])"
	assertEquals 'monday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[1])"
	assertEquals 'tuesday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[2])"
	assertEquals 'wednesday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[3])"
	assertEquals 'thursday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[4])"
	assertEquals 'friday' '[[600,1300],[1700,0]]' "$(echo "$actual" | jq -c .[0].timings.days[5])"
	assertEquals 'saturday' '[[730,1300],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.days[6])"
	assertEquals 'public holidays' '[[700,1500],[1800,0]]' "$(echo "$actual" | jq -c .[0].timings.publicHolidays)"
}

test_add_timings_when_mon_fri_has_separate_days() {
	input='[{
		"id": 282,
		"publicHolidays": "CLOSED",
		"sat": "9.00AM - 12.00PM",
		"monFri": "MON, TUE, WED & FRI:\n8.30AM - 12.15PM, \n2.00PM - 4.15PM,\n6.30PM - 8.30PM\n\nTHU:\n8.30AM - 12.15PM,\n6.30PM - 9.30PM",
		"sun": "CLOSED"
	}]'

	actual="$(echo $input | ../add-timings.cljs)"

	assertEquals 'monday' '[[830,1215],[1400,1615],[1830,2030]]' "$(echo "$actual" | jq -c .[0].timings.days[1])"
	assertEquals 'tuesday' '[[830,1215],[1400,1615],[1830,2030]]' "$(echo "$actual" | jq -c .[0].timings.days[2])"
	assertEquals 'wednesday' '[[830,1215],[1400,1615],[1830,2030]]' "$(echo "$actual" | jq -c .[0].timings.days[3])"
	assertEquals 'thursday' '[[830,1215],[1830,2130]]' "$(echo "$actual" | jq -c .[0].timings.days[4])"
	assertEquals 'friday' '[[830,1215],[1400,1615],[1830,2030]]' "$(echo "$actual" | jq -c .[0].timings.days[5])"
}

test_add_timings_when_mon_fri_includes_day_range() {
	input='[{
		"id": 282,
		"publicHolidays": "CLOSED",
		"sat": "9.00AM - 12.00PM",
		"monFri": "MON: \n8.30AM - 2.00PM \n\nTUE - FRI:\n8.30AM - 10.00PM",
		"sun": "CLOSED"
	}]'

	actual="$(echo $input | ../add-timings.cljs)"

	assertEquals 'monday' '[[830,1400]]' "$(echo "$actual" | jq -c .[0].timings.days[1])"
	assertEquals 'tuesday' '[[830,2200]]' "$(echo "$actual" | jq -c .[0].timings.days[2])"
	assertEquals 'wednesday' '[[830,2200]]' "$(echo "$actual" | jq -c .[0].timings.days[3])"
	assertEquals 'thursday' '[[830,2200]]' "$(echo "$actual" | jq -c .[0].timings.days[4])"
	assertEquals 'friday' '[[830,2200]]' "$(echo "$actual" | jq -c .[0].timings.days[5])"
}

test_normalise_values() {
	input='[{
		"id": 282,
		"publicHolidays": "CLOSED",
		"monFri": "  CLoSeD  ",
		"sat": "24 HOURS",
		"sun": "  24 HOuRS  "
	}]'

	actual="$(cd .. && echo $input | ./normalise_values.clj)"

	assertEquals 'id' '282' "$(echo "$actual" | jq -c .[0].id)"
	assertEquals 'publicHolidays' '"Closed"' "$(echo "$actual" | jq -c .[0].publicHolidays)"
	assertEquals 'monFri' '"24 Hours"' "$(echo "$actual" | jq -c .[0].sat)"
	assertEquals 'sat' '"Closed"' "$(echo "$actual" | jq -c .[0].publicHolidays)"
	assertEquals 'sun' '"24 Hours"' "$(echo "$actual" | jq -c .[0].sun)"
}

. ./shunit2
