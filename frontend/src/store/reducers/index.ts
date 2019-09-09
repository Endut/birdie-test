import { Visit } from 'common';
import { combineReducers } from 'redux';
import { endDateReducer, startDateReducer } from './dateReducers';
import { visitsReducer } from './visitsReducers';

export type RootState = Readonly<{
	startDate: Date,
	endDate: Date,
	visits: Visit[]
}>;

export const rootReducer = combineReducers<RootState>({
	startDate: startDateReducer,
	endDate: endDateReducer,
	visits: visitsReducer
});