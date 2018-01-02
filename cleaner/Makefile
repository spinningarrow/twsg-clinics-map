SHELL := /bin/bash

listing-with-positions.json: listing.json
	cat listing.json | ./add-positions.cljs > listing-with-positions.json

listing.json: listing.csv
	csvjson listing.csv > listing.json

listing.csv: listing-with-formatted-headers.csv
	csvcut -C 17 listing-with-formatted-headers.csv > listing.csv

listing-with-formatted-headers.csv: listing-raw.csv
	cat <(echo 'sN,zone,estate,clinicName,blk,roadName,unitNo,buildingName,postalCode,phone,fax,monFri,sat,sun,publicHolidays,clinicRemarks,') <(csvcut -K 8 test2.csv) > listing-with-formatted-headers.csv

listing-raw.csv: listing.xls
	in2csv listing.xls > listing-raw.csv
