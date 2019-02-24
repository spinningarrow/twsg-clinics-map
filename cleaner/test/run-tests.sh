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

test_add_timings() {
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

test_add_timings_when_suffix_is_capitalised() {
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

. ./shunit2
