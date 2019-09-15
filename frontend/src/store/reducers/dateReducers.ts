import { SET_START_DATE, SET_END_DATE } from '../actions/dateActions';
import { AnyAction } from 'redux'; 
 
// initial states for dates
// hard coded here to make code that uses these dates without side-effects
// for testing purposes, but can grab fresh dates in App component constructor
export const initStartDate = new Date('2019-04-23');
export const initEndDate = new Date('2019-05-12');


export interface DateState {
	startDate: Date,
	endDate: Date
}

export function startDateReducer(state: Date = initStartDate, action: AnyAction): Date {
	switch (action.type) {
		case SET_START_DATE: {
			return action.payload;
		}
		default: return state;
	}
}

export function endDateReducer(state: Date = initEndDate, action: AnyAction): Date {
	switch (action.type) {
		case SET_END_DATE: {
			return action.payload;
		}
		default: return state;
	}
}