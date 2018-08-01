import { filterFns } from './helpers.mjs'
import {
	mapMarkers,
	showMarkers,
	updateVisibleClinics,
	createMap,
	showCurrentLocation,
	addMarkers,
	addClinicSelectionListener,
} from './map.mjs'

// Map-related functions
const filterAndShow = filterFn => {
	mapMarkers
		.then(markers => {
			markers.forEach(marker => marker.setVisible(false))
			return markers
		})
		.then(markers =>
			markers.filter(marker => filterFns[filterFn](marker.clinic))
		)
		.then(showMarkers)
		.then(updateVisibleClinics)
}

export const init = async (clinicsElement, clinicsFilterElement) => {
	const map = createMap()
	showCurrentLocation(map)

	const markers = await addMarkers(map)
	showMarkers(markers)
	updateVisibleClinics(markers)

	addClinicSelectionListener(clinicsElement)
	clinicsFilterElement.addEventListener('change', event => {
		filterAndShow(event.target.value)
	})
}
