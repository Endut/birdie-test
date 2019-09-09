import { Visit } from 'common';
import { FETCH_VISITS_BEGIN, FETCH_VISITS_SUCCESS, FETCH_VISITS_ERROR } from '../actions/visitActions'; 

export function visitsReducer(state: Visit[] = [], action: any): Visit[] {
	switch (action.type) {
		case FETCH_VISITS_BEGIN: {
			return state
		}
		case FETCH_VISITS_SUCCESS: {
			console.log(action);
			return action.payload

		}
		case FETCH_VISITS_ERROR: {
			return state
		}
		default: return state
	}
}