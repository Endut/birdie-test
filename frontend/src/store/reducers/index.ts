import { combineReducers } from 'redux';
import { endDateReducer, startDateReducer } from './dateReducers';
import { visitsReducer, VisitsState } from './visitsReducers';

export type RootState = Readonly<{
	startDate: Date,
	endDate: Date,
	visitsState: VisitsState,
}>;

export const rootReducer = combineReducers<RootState>({
	startDate: startDateReducer,
	endDate: endDateReducer,
	visitsState: visitsReducer
});