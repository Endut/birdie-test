import { Visit, Event } from 'common';
import { RootState } from '@App/store/reducers';
import { VisitsState } from '@App/store/reducers/visitsReducers';
import { initStartDate, initEndDate } from '@App/store/reducers/dateReducers';
import { filterVisits, filterEvents, getVisitsLimits } from '@App/store/selectors'; 

const visitsState: VisitsState = {
  visits: [
    {
      care_recipient_id: '123123',
      caregiver_id: '00',
      visit_id: 'v0',
      date: '2019-01-01',
      events: [{
        id: 'e0',
        timestamp: '2019-01-01',
        event_type: 'check_in',
        payload: {
          id: 'e0',
          visit_id: 'v0',
          timestamp: '2019-01-01',
          event_type: 'check_in',
          caregiver_id: '1111',
          care_recipient_id: '123123'
        }
      }]
    },
    {
      care_recipient_id: '123123',
      caregiver_id: '00',
      visit_id: 'v1',
      date: '2019-01-02',
      events: [{
        id: 'e1',
        timestamp: '2019-01-02',
        event_type: 'check_in',
        payload: {
          id: 'e0',
          visit_id: 'v1',
          timestamp: '2019-01-02',
          event_type: 'check_in',
          caregiver_id: '1111',
          care_recipient_id: '123123'
        }
      }]
    },
    {
      care_recipient_id: '123123',
      caregiver_id: '00',
      visit_id: 'v2',
      date: '2019-01-10',
      events: [{
        id: 'e2',
        timestamp: '2019-01-10',
        event_type: 'check_in',
        payload: {
          id: 'e2',
          visit_id: 'v2',
          timestamp: '2019-01-10',
          event_type: 'check_in',
          caregiver_id: '1111',
          care_recipient_id: '123123'
        }
      }]
    }
  ],
  events: [
    {
      id: 'e0',
      timestamp: '2019-01-01',
      event_type: 'check_in',
      payload: {
        id: 'e0',
        visit_id: 'v0',
        timestamp: '2019-01-01',
        event_type: 'check_in',
        caregiver_id: '1111',
        care_recipient_id: '123123'
      }
    },
    {
      id: 'e1',
      timestamp: '2019-01-02',
      event_type: 'check_in',
      payload: {
        id: 'e0',
        visit_id: 'v1',
        timestamp: '2019-01-02',
        event_type: 'check_in',
        caregiver_id: '1111',
        care_recipient_id: '123123'
      }
    },
    {
      id: 'e2',
      timestamp: '2019-01-10',
      event_type: 'check_in',
      payload: {
        id: 'e2',
        visit_id: 'v2',
        timestamp: '2019-01-10',
        event_type: 'check_in',
        caregiver_id: '1111',
        care_recipient_id: '123123'
      }
    }
  ],
  isLoading: false
}

const state: RootState = {
  startDate: new Date('2019-01-02'),
  endDate: new Date('2019-01-05'),
  visitsState: visitsState,
  care_recipient_id: '123123'
}

describe('checking the selectors work correctly', () => {
  it('gets correct date range from visits in the state', () => {
    expect(getVisitsLimits(state)).toEqual({
      oldStartDate: new Date('2019-01-01'),
      oldEndDate: new Date('2019-01-10')
    })    
  });

  it('filters visits correctly', () => {
    expect(filterVisits(state)).toEqual([{
      care_recipient_id: '123123',
      caregiver_id: '00',
      visit_id: 'v1',
      date: '2019-01-02',
      events: [{
        id: 'e1',
        timestamp: '2019-01-02',
        event_type: 'check_in',
        payload: {
          id: 'e0',
          visit_id: 'v1',
          timestamp: '2019-01-02',
          event_type: 'check_in',
          caregiver_id: '1111',
          care_recipient_id: '123123'
        }
      }]
    }]);    
  });

  it('filters events correctly', () => {
    expect(filterEvents(state, 'check_in')).toEqual([{
      id: 'e1',
      timestamp: '2019-01-02',
      event_type: 'check_in',
      payload: {
        id: 'e0',
        visit_id: 'v1',
        timestamp: '2019-01-02',
        event_type: 'check_in',
        caregiver_id: '1111',
        care_recipient_id: '123123'
      }
    }]);    
  });

  it('filters mood events correctly', () => {
    expect(filterEvents(state)).toEqual([]);    
  });
})
