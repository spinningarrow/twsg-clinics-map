window.clinicsMap = (() => {
	const IS_TEST_ENV = location.href.indexOf('env=test') !== -1
	const CLINICS_DATA_URI = 'https://s3-ap-southeast-1.amazonaws.com/clinic-mapper/clinics.json.gz'
	const SINGAPORE_POSITION = { lat: 1.3554, lng: 103.8677 }

	let mapInfoWindow = null
	let resolveMapInitialised
	let resolveMarkers

	const googleMapsInitialised = new Promise(resolve =>
		resolveMapInitialised = resolve)
	const mapMarkers = new Promise(resolve => resolveMarkers = resolve)

	// Helpers
	const address = ({ blk, roadName, unitNo, buildingName, zone, postalCode }) => [
		`${blk} ${roadName}`.trim(),
		`${unitNo} ${buildingName}`.trim(),
		`${zone.match(/malaysia/i) ? 'Malaysia' : 'Singapore'} ${postalCode}`.trim(),
	]

	const infoWindowContent = clinic => {
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
		} = clinic

		const content = `
${clinicName}
${address(clinic).join('\n')}

Phone: ${phone}

Mon-Fri: ${monFri}
Sat: ${sat}
Sun: ${sun}
Public Holidays: ${publicHolidays}

${clinicRemarks ? 'Remarks: ' + clinicRemarks : ''}`

		return content.trim().replace(/\n/g, '<br>')
	}

	const filterFns = {
		isOpenOnSaturdays: clinic => clinic.sat && !clinic.sat.includes('Closed'),
		isOpenOnSundays: clinic => clinic.sun && !clinic.sun.includes('Closed'),
		isOpenOnPublicHolidays: clinic => clinic.publicHolidays && !clinic.publicHolidays.includes('Closed'),
		isOpen24Hours: clinic => ([
			clinic.monFri,
			clinic.sat,
			clinic.sun,
			clinic.publicHolidays,
			clinic.clinicRemarks
		].find(v => v && (v.includes('24 Hour') || v.includes('24 Hr')))),
		isOpenNow: clinic => {
			const now = new Date()
			const timing = now.getHours() * 100 + now.getMinutes()
			const day = now.getDay()
			// TODO check for public holidays
			const intervals = clinic.timings.days[day]

			// TODO check for intervals like [1830, 0]
			return intervals &&
				intervals.filter(([start, end]) => timing >= start && timing <= end).length
		},
		all: Boolean,
	}

	// Map-related functions
	const onMarkerClick = (clinicsMap, { clinic: { id: clinicId }}) => () => {
		location.hash = '#control-panel'
		selectMarker(clinicId - 1, { shouldFocus: false })

		const clinicsItem = document.querySelector(`[data-clinic-id="${clinicId}"]`)
		const clinicsElement = document.querySelector('#clinics')
		selectClinicsItem(clinicsElement, clinicsItem, { shouldAnimateScroll: false })
	}

	const addMarkers = clinicsMap => fetch(CLINICS_DATA_URI)
		.then(response => response.json())
		.then(clinics => clinics.map(clinic => new google.maps.Marker({
			clinic,
			position: clinic.position,
			map: clinicsMap,
			optimized: !IS_TEST_ENV,
		}))).then(markers => {
			resolveMarkers(markers)

			markers.forEach(marker => google.maps.event.addListener(
				marker,
				'click',
				onMarkerClick(clinicsMap, marker)
			))

			return markers
		})

	const showMarkers = markers => {
		markers.forEach(marker => marker.setVisible(true))
		return markers
	}

	const filterAndShow = filterFn => {
		mapMarkers
			.then(markers => {
				markers.forEach(marker => marker.setVisible(false))
				return markers
			})
			.then(markers =>
				markers.filter(marker => filterFns[filterFn](marker.clinic)))
				.then(showMarkers)
				.then(updateVisibleClinics)
	}

	const createMap = () => new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: SINGAPORE_POSITION,
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP,
		},
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP,
		}
	})

	// Clinics list
	const ClinicItem = clinic => `
		<li data-clinic-id="${clinic.id}">
			<p class="clinic-name">${clinic.clinicName}</p>
			<p class="clinic-address">${address(clinic).join(', ')}</p>
			<div class="more-info">
				Phone: ${clinic.phone}<br>
				Mon-Fri: ${clinic.monFri}<br>
				Sat: ${clinic.sat}<br>
				Sun: ${clinic.sun}<br>
				Public Holidays: ${clinic.publicHolidays}<br>
				${clinic.clinicRemarks ? 'Remarks: ' + clinic.clinicRemarks : ''}
			</div>
		</li>
	`

	const updateVisibleClinics = markers => {
		const visibleClinics = markers.map(marker => marker.clinic)

		document.querySelector('#clinics').innerHTML = visibleClinics.map(ClinicItem).join('')
	}

	const selectClinicsItem = (clinicsElement, item, { shouldAnimateScroll = true } = {}) => {
		clinicsElement.querySelectorAll('li').forEach(element =>
			element.classList.remove('selected')
		)
		item.classList.toggle('selected')
		item.scrollIntoView({ behavior: shouldAnimateScroll ? 'smooth' : 'instant' })
	}

	const selectMarker = async (markerIndex, { shouldFocus = true } = {}) => {
		const markers = await mapMarkers
		markers.forEach(marker => marker.setAnimation(null))
		const marker = markers[markerIndex]
		marker.setAnimation(google.maps.Animation.BOUNCE)

		if (shouldFocus) {
			marker.map.setZoom(15)
			if (!marker.map.getBounds().contains(marker.getPosition())) {
				marker.map.setCenter(marker.getPosition())
			}
		}
	}

	const addClinicSelectionListener = () => {
		const clinicsElement = document.querySelector('#clinics')

		clinicsElement.addEventListener('click', event => {
			if (event.target.tagName !== 'LI') return

			selectClinicsItem(clinicsElement, event.target)

			const markerIndex = parseInt(event.target.dataset.clinicId) - 1
			selectMarker(markerIndex)
		})
	}

	// Init
	googleMapsInitialised
		.then(createMap)
		.then(addMarkers)
		.then(showMarkers)
		.then(updateVisibleClinics)
		.then(addClinicSelectionListener)

	return {
		resolveMapInitialised,
		filterAndShow,
	}
})()
