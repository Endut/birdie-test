import { Visit } from '@App/common';

export const FETCH_VISITS_BEGIN = 'FETCH_VISITS_BEGIN';
export const FETCH_VISITS_SUCCESS = 'FETCH_VISITS_SUCCESS';
export const FETCH_VISITS_ERROR = 'FETCH_VISITS_ERROR';

export const fetchVisitsBegin = (care_recipient_id: string, startDate: Date, endDate: Date) => ({
	type: FETCH_VISITS_BEGIN,
	care_recipient_id: care_recipient_id,
	startDate: startDate,
	endDate: endDate
});

export const fetchVisitsSuccess = (visits: Visit[]) => ({
	type: FETCH_VISITS_SUCCESS,
	payload: visits
});

export const fetchVisitsError = (error: Error) => ({
	type: FETCH_VISITS_ERROR,
	payload: error
})