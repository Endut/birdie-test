import { SET_START_DATE, SET_END_DATE, DateActionType } from '../actions/dateActions';

// initial states for dates
// hard coded here to make code that uses these dates without side-effects
// for testing purposes, but can grab fresh dates in App component constructor
export const initStartDate = new Date(2019, 3, 22);

export const initEndDate = new Date(2019, 4, 11);

export interface DateState {
	startDate: Date,
	endDate: Date
}

export function startDateReducer(state: Date = initStartDate, action: DateActionType): Date {
	switch (action.type) {
		case SET_START_DATE: {
			return action.payload;
		}
		default: return state;
	}
}

export function endDateReducer(state: Date = initEndDate, action: DateActionType): Date {
	switch (action.type) {
		case SET_END_DATE: {
			return action.payload;
		}
		default: return state;
	}
}