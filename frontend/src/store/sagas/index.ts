import { needsNewDataSaga, fetchVisitsSaga } from './sagas';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
	yield all([
		needsNewDataSaga(),
		fetchVisitsSaga()
		])
}