import { SET_START_DATE, SET_END_DATE, DateActionType } from '../actions/dateActions';

// initial states for dates
const endDate = new Date();
const startDate = new Date(endDate);
startDate.setMonth(startDate.getMonth() - 12);

export interface DateState {
	startDate: Date,
	endDate: Date
}

export function startDateReducer(state: Date = startDate, action: DateActionType): Date {
	switch (action.type) {
		case SET_START_DATE: {
			console.log("set start date reducer");
			return action.payload;
		}
		default: return state;
	}
}

export function endDateReducer(state: Date = endDate, action: DateActionType): Date {
	switch (action.type) {
		case SET_END_DATE: {
			console.log("set end date reducer");
			return action.payload;
		}
		default: return state;
	}
}