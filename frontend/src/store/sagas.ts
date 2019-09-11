import { call, put, takeEvery, all, select/*, takeLatest, select*/ } from 'redux-saga/effects';
import { fetchVisits as fetchVisitsFromAPI } from '../api';
import { FETCH_VISITS_BEGIN, fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from './actions/visitActions'; 
import { SET_START_DATE, SET_END_DATE, DateActionType } from './actions/dateActions';
import { RootState } from './reducers';
import { getStartDate, getEndDate } from './reducers/visitsReducers';
import { AnyAction } from 'redux'; 
 
const getVisitsLimits = (state: RootState) => {
	const visits = state.visitsState.visits;
	return {
		// not really 'old start date' in the state (/'local db'), just date of oldest visit in the state (/ 'local db')
		// if date filter is requesting visits older than that then we must fetch them from the backend
		oldStartDate: getStartDate(visits),
		
		// not really 'old end date' in the state, just most date of most recent visit in the state (/ 'local db')
		// if date filter is requesting visits younger than that then we must fetch them from the backend
		oldEndDate: getEndDate(visits) }
}

const getCareRecipient = (state: RootState) => {
	const visits = state.visitsState.visits;
	return visits[0] ? visits[0].care_recipient_id : ''; 
}


function* parseDatesAndFetch(dateAction: DateActionType) {
	const { oldStartDate, oldEndDate } = yield select(getVisitsLimits);
	const care_recipient_id = yield select(getCareRecipient);
	switch (dateAction.type) {
		case SET_START_DATE: {
			const startDate = dateAction.payload;
			if (startDate.getTime() < oldStartDate.getTime()) {
				yield put(fetchVisitsBegin(care_recipient_id, startDate, oldStartDate));
			}
			break;
		}
		case SET_END_DATE: {
			const endDate = dateAction.payload;
			if (endDate.getTime() > oldEndDate.getTime()) {
				yield put(fetchVisitsBegin(care_recipient_id, oldEndDate, endDate));
			}
			break;
		}
	}
}

function* fetchVisitsTask(action: AnyAction) {
	const { care_recipient_id, startDate, endDate } = action;
	try {
		const data = yield call(fetchVisitsFromAPI, care_recipient_id, startDate, endDate);
		yield put(fetchVisitsSuccess(data))
	} catch (error) {
		yield put(fetchVisitsError(error))
	}
}

function* needsNewDataSaga() {
	yield takeEvery([SET_START_DATE, SET_END_DATE], parseDatesAndFetch);
}

function* fetchVisitsSaga() {
	yield takeEvery(FETCH_VISITS_BEGIN, fetchVisitsTask);
}

export default function* rootSaga() {
	yield all([
		needsNewDataSaga(),
		fetchVisitsSaga()
		])
}