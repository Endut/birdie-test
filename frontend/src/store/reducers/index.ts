import { combineReducers } from 'redux';

import { Visit } from 'common';

export type RootState = Readonly<{
	dateRange: [Date, Date];
	visits: Visit[];
}>;

function dateRangeReducer(state: [Date, Date] = [new Date(), new Date()], action: {type: string, dates: [Date, Date]}): [Date, Date] {
	switch (action.type) {
		default: return state
	}
}

function visitsReducer(state: Visit[] = [], action: {type: string, visit: Visit}): Visit[] {
	switch (action.type) {
		default: return state
	}
}
    
export const rootReducer = combineReducers<RootState>({
	dateRange: dateRangeReducer,
	visits: visitsReducer
	});
