import { Visit, Event } from 'common';
import { RootState } from './reducers';

import { initStartDate, initEndDate } from './reducers/dateReducers';

export function getStartDate(visits: Visit[]): Date {
  return visits[0] ? new Date(visits[0].date) : initStartDate;
}

export function getEndDate(visits: Visit[]): Date {
  return visits[visits.length - 1] ? new Date(visits[visits.length - 1].date) : initEndDate;
}

export const getVisitsLimits = (state: RootState): { oldStartDate: Date, oldEndDate: Date } => {
	const visits = state.visitsState.visits;
	return {
		// not really 'old start date' in the state (/'local db'), just date of oldest visit in the state (/ 'local db')
		// if date filter is requesting visits older than that then we must fetch them from the backend
		oldStartDate: getStartDate(visits),
		
		// not really 'old end date' in the state, just most date of most recent visit in the state (/ 'local db')
		// if date filter is requesting visits younger than that then we must fetch them from the backend
		oldEndDate: getEndDate(visits) }
}

export const getCareRecipient = (state: RootState): string => {
	const visits = state.visitsState.visits;
	return visits[0] ? visits[0].care_recipient_id : ''; 
}

export function getRelevantVisitsDesc(state: RootState, events_descending: boolean = true): Visit[] {
	const visits = state.visitsState.visits;
	const startDate = state.startDate;
	const endDate = state.endDate;
  const visitsArray: Visit[] = [];
  let visit: Visit;
  let visitDate: Date;
  for (let i = visits.length - 1; i >= 0; i--) {
    // using this instead of fancy declarative Array.prototype methods (eg visits.reverse().filter(...))
    // to avoid having 2 potentially costly loops over visits array
    visit = visits[i];
    visitDate = new Date(visit.date);
      
    if (events_descending) {
      visit.events = visit.events.reverse();
    }
    if ((visitDate.getTime() >= startDate.getTime()) && (visitDate.getTime() <= endDate.getTime())) {
      visitsArray.push(visit);
    }
  }
  return visitsArray
}

export function filterVisits(state: RootState): Visit[] {
  const visits = state.visitsState.visits;
  const startDate = state.startDate;
  const endDate = state.endDate;
  const visitsArray: Visit[] = [];
  let visit: Visit;
  let visitDate: Date;
  for (let i = 0; i < visits.length; i++) {
    // using this instead of fancy declarative Array.prototype methods (eg visits.reverse().filter(...))
    // to avoid having 2 potentially costly loops over visits array
    visit = visits[i];
    visitDate = new Date(visit.date);

    if ((visitDate.getTime() >= startDate.getTime()) && (visitDate.getTime() <= endDate.getTime())) {
      visitsArray.push(visit);
    }
  }
  return visitsArray;
}

export function filterEvents(state: RootState, event_type: string = 'mood_observation'): Event[] {
  
  const events = state.visitsState.events;
  const startDate = state.startDate;
  const endDate = state.endDate;
  const eventsArray: Event[] = [];
  let event: Event;
  let eventDate: Date;
  for (let i = 0; i < events.length; i++) {
    event = events[i];
    eventDate = new Date(event.timestamp);
    if (
      (eventDate.getTime() >= startDate.getTime()) && 
      (eventDate.getTime() <= endDate.getTime()) && 
      (event.event_type === event_type)
    ) {
      eventsArray.push(event);
    }
  }
  return eventsArray;
}