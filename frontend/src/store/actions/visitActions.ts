import { Visit } from 'common';

export const FETCH_VISITS_BEGIN = 'FETCH_VISITS_BEGIN';
export const FETCH_VISITS_SUCCESS = 'FETCH_VISITS_SUCCESS';
export const FETCH_VISITS_ERROR = 'FETCH_VISITS_ERROR';

export const fetchVisitsBegin = (apiCredentials: any, startDate: Date, endDate: Date) => ({
	type: FETCH_VISITS_BEGIN,
	payload: ""
});

export const fetchVisitsSuccess = (visits: Visit[]) => ({
	type: FETCH_VISITS_SUCCESS,
	payload: visits
});

export const fetchVisitsError = (error: Error) => ({
	type: FETCH_VISITS_ERROR,
	payload: error
})