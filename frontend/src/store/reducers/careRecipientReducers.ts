import { SET_CARE_RECIPIENT } from '../actions/careRecipientActions';
import { AnyAction } from 'redux'; 

export function careRecipientReducer(state: string = '', action: AnyAction): string {
	switch (action.type) {
		case SET_CARE_RECIPIENT: {
			return action.payload;
		}
		default: return state;
	}
}