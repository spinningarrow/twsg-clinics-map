export const address = ({
	blk,
	roadName,
	unitNo,
	buildingName,
	zone,
	postalCode,
}) => [
	`${blk} ${roadName}`.trim(),
	`${unitNo} ${buildingName}`.trim(),
	`${
		zone.match(/malaysia/i) ? 'Malaysia' : 'Singapore'
	} ${postalCode}`.trim(),
]

export const filterFns = {
	isOpenOnSaturdays: clinic => clinic.sat && !clinic.sat.includes('Closed'),
	isOpenOnSundays: clinic => clinic.sun && !clinic.sun.includes('Closed'),
	isOpenOnPublicHolidays: clinic =>
		clinic.publicHolidays && !clinic.publicHolidays.includes('Closed'),
	isOpen24Hours: clinic =>
		[
			clinic.monFri,
			clinic.sat,
			clinic.sun,
			clinic.publicHolidays,
			clinic.clinicRemarks,
		].find(v => v && (v.includes('24 Hour') || v.includes('24 Hr'))),
	isOpenNow: clinic => {
		const now = new Date()
		const timing = now.getHours() * 100 + now.getMinutes()
		const day = now.getDay()
		// TODO check for public holidays
		const intervals = clinic.timings.days[day]

		// TODO check for intervals like [1830, 0]
		return (
			intervals &&
			intervals.filter(([start, end]) => timing >= start && timing <= end)
				.length
		)
	},
	all: Boolean,
}
