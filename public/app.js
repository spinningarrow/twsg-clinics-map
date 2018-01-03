function initMap() {
	const singapore = {lat: 1.3554, lng: 103.8677};
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: singapore
	});
	window.map = map
	var infoWindow = new google.maps.InfoWindow();

	fetch('https://s3-ap-southeast-1.amazonaws.com/clinic-mapper/axa-14-july-2017-with-positions.json.gz')
		.then(response => response.json())
		.then(clinics => clinics.map(clinic => new google.maps.Marker({
			clinic,
			position: clinic.position,
			map: map
		}))).then(markers => {
			window.markers = markers
			markers.forEach(marker => {
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.close();
					infoWindow = new google.maps.InfoWindow();
					const {
						clinicName,
						monFri,
						sat,
						sun,
						publicHolidays,
						clinicRemarks,
						blk,
						roadName,
						unitNo,
						buildingName,
						postalCode,
						phone,
					} = marker.clinic
					const infoContent = `
${clinicName}
${blk} ${roadName}
${unitNo} ${buildingName}
Singapore ${postalCode}

Phone: ${phone}

Mon-Fri: ${monFri}
Sat: ${sat}
Sun: ${sun}
Public Holidays: ${publicHolidays}

${clinicRemarks ? 'Remarks: ' + clinicRemarks : ''}`
					infoWindow.setContent(infoContent.trim().replace(/\n/g, '<br>'));
					infoWindow.open(map, marker);
				});
			})
		})
}

const filterFns = {
	isOpenOnSaturdays: clinic => !clinic.sat.includes('Closed'),
	isOpenOnSundays: clinic => !clinic.sun.includes('Closed'),
	isOpenOnPublicHolidays: clinic => !clinic.publicHolidays.includes('Closed'),
	isOpen24Hours: clinic => ([
		clinic.monFri,
		clinic.sat,
		clinic.sun,
		clinic.publicHolidays,
		clinic.clinicRemarks
	].find(v => v && (v.includes('24 Hour') || v.includes('24 Hr')))),
}

function showMarkers(markers) {
	markers.forEach(marker => marker.setVisible(true))
}

function filterAndShow(filterFn, markers) {
	markers.forEach(marker => marker.setVisible(false))
	showMarkers(markers.filter(marker => filterFns[filterFn](marker.clinic)))
}
