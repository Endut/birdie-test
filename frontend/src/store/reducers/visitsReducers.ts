import { Visit } from 'common';
import { FETCH_VISITS_BEGIN, FETCH_VISITS_SUCCESS, FETCH_VISITS_ERROR } from '../actions/visitActions'; 
import { initStartDate, initEndDate } from './dateReducers';

export function getEndDate(visits: Visit[]): Date {
  return visits[0] ? new Date(visits[0].date) : initEndDate;
}

export function getStartDate(visits: Visit[]): Date {
  return visits[visits.length - 1] ? new Date(visits[visits.length - 1].date) : initStartDate;
}

export interface VisitsState {
  isLoading: boolean;
  visits: Visit[];
}

const initVisitsState = {
  isLoading: false,
  visits: []
}

function addNewVisits(oldVisits: Visit[], newVisits: Visit[]): Visit[] {
  if (oldVisits.length === 0) {
    return newVisits;
  }

  if (newVisits.length === 0) {
    return oldVisits
  }

  const oldEndDate = getEndDate(oldVisits);
  const newEndDate = getEndDate(newVisits);

  const oldStartDate = getStartDate(oldVisits);
  const newStartDate = getStartDate(newVisits);
  
  if (newEndDate.getTime() >= oldEndDate.getTime() && newStartDate.getTime() <= oldStartDate.getTime()) {
    
    return newVisits
  
  } else if (newStartDate.getTime() > oldEndDate.getTime()) {

    return oldVisits.concat(newVisits)
  
  } else if (newEndDate.getTime() < oldStartDate.getTime()) {
    
    return newVisits.concat(oldVisits)
  
  } else {
    
    return oldVisits
  
  }
}

export function visitsReducer(state: VisitsState = initVisitsState, action: any): VisitsState {
	switch (action.type) {
		case FETCH_VISITS_BEGIN: {
			return { ...state, isLoading: true }
		}
		case FETCH_VISITS_SUCCESS: {
      return { visits: addNewVisits(state.visits, action.payload), isLoading: false};
		}
		case FETCH_VISITS_ERROR: {
			return { ...state, isLoading: false };
		}
		default: return state
	}
}
