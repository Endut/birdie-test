import { combineReducers } from 'redux';
import { endDateReducer, startDateReducer } from './dateReducers';
import { visitsReducer, VisitsState } from './visitsReducers';
import { careRecipientReducer } from './careRecipientReducers';

export type RootState = Readonly<{
	startDate: Date,
	endDate: Date,
	visitsState: VisitsState,
	care_recipient_id: string
}>;

export const rootReducer = combineReducers<RootState>({
	startDate: startDateReducer,
	endDate: endDateReducer,
	visitsState: visitsReducer,
	care_recipient_id: careRecipientReducer
});