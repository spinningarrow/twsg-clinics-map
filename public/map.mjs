import { address } from './helpers.mjs'

const IS_TEST_ENV = location.href.indexOf('env=test') !== -1
const CLINICS_DATA_URI =
	'https://s3-ap-southeast-1.amazonaws.com/clinic-mapper/clinics.json.gz'
const SINGAPORE_POSITION = { lat: 1.3554, lng: 103.8677 }

let resolveMarkers
export const mapMarkers = new Promise(resolve => (resolveMarkers = resolve))

export const createMap = () =>
	new window.google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: SINGAPORE_POSITION,
		streetViewControl: true,
		streetViewControlOptions: {
			position: window.google.maps.ControlPosition.RIGHT_TOP,
		},
		zoomControl: true,
		zoomControlOptions: {
			position: window.google.maps.ControlPosition.RIGHT_TOP,
		},
	})

export const showCurrentLocation = map => {
	navigator.geolocation.getCurrentPosition(
		({ coords: { latitude: lat, longitude: lng } }) => {
			const position = {
				lat,
				lng,
			}

			new window.google.maps.InfoWindow({
				position,
				content: 'You are here',
			}).open(map)

			new window.google.maps.Marker({
				position,
				map,
				icon: {
					path: window.google.maps.SymbolPath.CIRCLE,
					scale: 6,
					fillColor: 'dodgerblue',
					fillOpacity: 1,
					strokeColor: 'white',
					strokeWeight: 1,
				},
			})

			map.setCenter(position)
			map.setZoom(15)
		}
	)

	return map
}

const selectMarker = async (markerIndex, { shouldFocus = true } = {}) => {
	const markers = await mapMarkers
	markers.forEach(marker => marker.setAnimation(null))
	const marker = markers[markerIndex]
	marker.setAnimation(window.google.maps.Animation.BOUNCE)

	if (shouldFocus) {
		marker.map.setZoom(15)
		if (!marker.map.getBounds().contains(marker.getPosition())) {
			marker.map.setCenter(marker.getPosition())
		}
	}
}

const selectClinicsItem = (
	clinicsElement,
	item,
	{ shouldAnimateScroll = true } = {}
) => {
	clinicsElement
		.querySelectorAll('li')
		.forEach(element => element.classList.remove('selected'))
	item.classList.toggle('selected')
	item.scrollIntoView({
		behavior: shouldAnimateScroll ? 'smooth' : 'instant',
	})
}

const onMarkerClick = (clinicsMap, { clinic: { id: clinicId } }) => () => {
	location.hash = '#control-panel'
	selectMarker(clinicId - 1, { shouldFocus: false })

	const clinicsItem = document.querySelector(`[data-clinic-id="${clinicId}"]`)
	const clinicsElement = document.querySelector('#clinics')
	selectClinicsItem(clinicsElement, clinicsItem, {
		shouldAnimateScroll: false,
	})
}

export const addMarkers = clinicsMap =>
	fetch(CLINICS_DATA_URI)
		.then(response => response.json())
		.then(clinics =>
			clinics.map(
				clinic =>
					new window.google.maps.Marker({
						clinic,
						position: clinic.position,
						map: clinicsMap,
						optimized: !IS_TEST_ENV,
					})
			)
		)
		.then(markers => {
			resolveMarkers(markers)

			markers.forEach(marker =>
				window.google.maps.event.addListener(
					marker,
					'click',
					onMarkerClick(clinicsMap, marker)
				)
			)

			return markers
		})

export const showMarkers = markers => {
	markers.forEach(marker => marker.setVisible(true))
	return markers
}

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

export const updateVisibleClinics = markers => {
	const visibleClinics = markers.map(marker => marker.clinic)

	document.querySelector('#clinics').innerHTML = visibleClinics
		.map(ClinicItem)
		.join('')
}

export const addClinicSelectionListener = clinicsElement => {
	clinicsElement.addEventListener('click', event => {
		if (event.target.tagName !== 'LI') return

		selectClinicsItem(clinicsElement, event.target)

		const markerIndex = parseInt(event.target.dataset.clinicId) - 1
		selectMarker(markerIndex)
	})
}
