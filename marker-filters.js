const withMarkers = f => f.bind(this, window.markers)
const withClinics = f => f.bind(this, window.clinics)

const showMarker = m => m.setVisible(true)
const hideMarker = m => m.setVisible(false)

const showAll = markers => markers.forEach(showMarker)
const hideAll = markers => markers.forEach(hideMarker)

const showClinic = (markers, c) => showMarker(markers[c['S/N'] - 1])
const hideClinic = (markers, c) => hideMarker(markers[c['S/N'] - 1])

const isOpenOnSaturdays = c => !c.SAT.includes('Closed')
const isOpenOnSundays = c => !c.SUN.includes('Closed')
const isOpenOnPublicHolidays = c => !c['PUBLIC HOLIDAYS'].includes('Closed')
const isOpen24Hours = c => [c['MON - FRI'], c.SAT, c.SUN, c['PUBLIC HOLIDAYS'], c['CLINIC REMARKS']].find(v => v.includes('24 Hour') || v.includes('24 Hr'))

const showFilteredClinics = function (filterFn) {
	let filteredClinics
	return function (clinics) {
		if (!filteredClinics) filteredClinics = clinics.filter(filterFn)
		withMarkers(hideAll)()
		filteredClinics.forEach(withMarkers(showClinic))
	}
}

const showClinicsOpenOnSaturdays = withClinics(showFilteredClinics(isOpenOnSaturdays))
const showClinicsOpenOnSundays = withClinics(showFilteredClinics(isOpenOnSundays))
const showClinicsOpenOnPublicHolidays = withClinics(showFilteredClinics(isOpenOnPublicHolidays))
const showClinicsOpen24Hours = withClinics(showFilteredClinics(isOpen24Hours))
