import { setStartDate, setEndDate } from '@App/store/actions/dateActions';
import { startDateReducer, endDateReducer } from '@App/store/reducers/dateReducers';

describe('start date reducer', () => {
	it('sets new date', () => {
		const oldDate = new Date('2019-05-08');
		const newDate = new Date('2019-05-09');
		expect(startDateReducer(oldDate, setStartDate(newDate))).toEqual(newDate);
	});

	it('does not set new date', () => {
		const oldDate = new Date('2019-05-08');
		const newDate = new Date('2019-05-09');
		expect(startDateReducer(oldDate, setEndDate(newDate))).toEqual(oldDate);
	});
});

describe('end date reducer', () => {
	it('sets new date', () => {
		const oldDate = new Date('2019-05-08');
		const newDate = new Date('2019-05-09');
		expect(endDateReducer(oldDate, setEndDate(newDate))).toEqual(newDate);
	});
	it('does not set new date', () => {
		const oldDate = new Date('2019-05-08');
		const newDate = new Date('2019-05-09');
		expect(endDateReducer(oldDate, setStartDate(newDate))).toEqual(oldDate);
	});
});