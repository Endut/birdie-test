import { call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchVisits as fetchVisitsFromAPI } from '../../api';
import { FETCH_VISITS_BEGIN, fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '../actions/visitActions'; 
import { SET_START_DATE, SET_END_DATE } from '../actions/dateActions';

import { AnyAction } from 'redux'; 
import { getVisitsLimits, getCareRecipient } from '../selectors';

export function* parseDatesAndFetch(action: AnyAction) {
	const { oldStartDate, oldEndDate } = yield select(getVisitsLimits);
	const care_recipient_id = yield select(getCareRecipient);
	switch (action.type) {
		case SET_START_DATE: {
			const startDate = action.payload;
			if (startDate.getTime() < oldStartDate.getTime()) {
				yield put(fetchVisitsBegin(care_recipient_id, startDate, oldStartDate));
			}
			break;
		}
		case SET_END_DATE: {
			const endDate = action.payload;
			if (endDate.getTime() > oldEndDate.getTime()) {
				yield put(fetchVisitsBegin(care_recipient_id, oldEndDate, endDate));
			}
			break;
		}
	}
}

export function* fetchVisitsTask(action: AnyAction) {
	const { care_recipient_id, startDate, endDate } = action;
	try {
		const data = yield call(fetchVisitsFromAPI, care_recipient_id, startDate, endDate);
		yield put(fetchVisitsSuccess(data))
	} catch (error) {
		yield put(fetchVisitsError(error))
	}
}

export function* needsNewDataSaga() {
	yield takeEvery([SET_START_DATE, SET_END_DATE], parseDatesAndFetch);
}

export function* fetchVisitsSaga() {
	yield takeEvery(FETCH_VISITS_BEGIN, fetchVisitsTask);
}
