export const SET_START_DATE = 'SET_START_DATE';
export const SET_END_DATE = 'SET_END_DATE';

export const setStartDate = (date: Date) => ({
	type: SET_START_DATE,
	payload: date
});

export const setEndDate = (date: Date) => ({
	type: SET_END_DATE,
	payload: date
});



