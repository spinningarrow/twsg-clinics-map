import { Selector } from 'testcafe'

const URI = 'http://localhost:8000/?env=test'

fixture `TWSG Clinics`
	.page `${URI}`


test('shows the Control Panel', async t => {
	const controlPanel = await Selector('#control-panel')

	await t
		.expect(controlPanel.exists).ok()
})

test('shows the markers on the map', async t => {
	const map = await Selector('#map').find('div')
	const markers = await map.find('map[name]', {
		visibilityCheck: true,
	})

	await t
		.expect(markers.count).eql(543)
})

test('shows the clinics list', async t => {
	const clinicsList = await Selector('#clinics').find('li')

	await t
		.expect(clinicsList.count).eql(544)
})

test('updates the clinics list when filtered', async t => {
	const filterDropdown = await Selector('#js-filter-dropdown')
	const saturdaysFilter = await filterDropdown.find('[value="isOpenOnSaturdays"]')
	const clinicsList = await Selector('#clinics').find('li')

	await t
		.click(filterDropdown)
		.click(saturdaysFilter)

	await t
		.expect(clinicsList.count).lt(544)
})
