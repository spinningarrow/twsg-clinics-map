SHELL := /bin/bash

clinics.json.gz: clinics.json
	gzip --stdout --best clinics.json > clinics.json.gz

clinics.json: clinics-without-positions.json positions.json
	./merge.cljs clinics-without-positions.json positions.json > clinics.json

positions.json: clinics-without-positions.json
	cat clinics-without-positions.json | ./get-positions.cljs > positions.json

clinics-without-positions.json: clinics-dirty.json
	cat clinics-dirty.json | ./clean-numbers.cljs > clinics-without-positions.json

clinics-dirty.json: clinics.csv
	csvjson --blank clinics.csv > clinics-dirty.json

clinics.csv: clinics-header-and-data.csv
	csvcut --not-columns 17 clinics-header-and-data.csv > clinics.csv

clinics-header-and-data.csv: clinics-data-rows.csv
	cat <(echo 'id,zone,estate,clinicName,blk,roadName,unitNo,buildingName,postalCode,phone,fax,monFri,sat,sun,publicHolidays,clinicRemarks,') clinics-data-rows.csv > clinics-header-and-data.csv

clinics-data-rows.csv: clinics-raw.csv
	csvgrep --columns 1 --regex '^[0-9]+\.?[0-9]*$$' clinics-raw.csv | tail -n +2 > clinics-data-rows.csv

clinics-raw.csv: clinics.xlsx
	in2csv clinics.xlsx > clinics-raw.csv

clean:
	rm -f *.json *.csv *.gz
