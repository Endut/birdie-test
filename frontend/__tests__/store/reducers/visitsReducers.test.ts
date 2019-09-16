import { Visit } from 'common';
// import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '../actions/visitActions';
import { addNewVisits, VisitsState, visitsReducer } from '@App/store/reducers/visitsReducers';
import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '@App/store/actions/visitActions';

// more recent -> older
const newEvent = {
  id: 'e3',
  timestamp: '2019-05-01',
  event_type: 'check_in',
  payload: {
    id: 'e3',
    visit_id: '0',
    timestamp: '2019-05-01',
    event_type: 'check_in',
    caregiver_id: '321321',
    care_recipient_id: '123123'
  }
};

const visit_0: Visit = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '0',
  date: '2019-05-01',
  events: [newEvent]
};
const visit_1: Visit = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '1',
  date: '2019-05-02',
  events: []
};
const visit_2: Visit = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '2',
  date: '2019-05-03',
  events: []
};
const visit_3: Visit = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '3',
  date: '2019-05-03',
  events: []
};

const oldEvents = [
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
    timestamp: '2019-01-03',
    event_type: 'check_in',
    payload: {
      id: 'e2',
      visit_id: 'v2',
      timestamp: '2019-01-03',
      event_type: 'check_in',
      caregiver_id: '1111',
      care_recipient_id: '123123'
    }
  }
];

const oldVisits = [
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
    date: '2019-01-03',
    events: [{
      id: 'e2',
      timestamp: '2019-01-03',
      event_type: 'check_in',
      payload: {
        id: 'e2',
        visit_id: 'v2',
        timestamp: '2019-01-03',
        event_type: 'check_in',
        caregiver_id: '1111',
        care_recipient_id: '123123'
      }
    }]
  }
];

const oldVisitsState: VisitsState = {
  visits: oldVisits,
  events: oldEvents,
  isLoading: false
}


describe('add new visits function', () => {
  it('empty previous state', () => {
    const prevState: Visit[] = [];
    const newState: Visit[] = [ visit_0, visit_1, visit_2, visit_3 ];
    expect(addNewVisits(prevState, newState)).toEqual(newState);
  });

  it('empty new state', () => {
    const prevState: Visit[] = [ visit_0, visit_1, visit_2, visit_3 ];
    const newState: Visit[] = [];
    expect(addNewVisits(prevState, newState)).toEqual(prevState);
  });

  it('new state date range contains previous state date range', () => {
    const prevState: Visit[] = [ visit_1, visit_2 ];
    const newState: Visit[] = [ visit_0, visit_1, visit_2, visit_3 ];
    expect(addNewVisits(prevState, newState)).toEqual(newState)
  });

  it('new state date range is after old state date range', () => {
    const prevState: Visit[] = [ visit_0, visit_1 ];
    const newState: Visit[] = [ visit_2, visit_3 ];
    expect(addNewVisits(prevState, newState)).toEqual([ visit_0, visit_1, visit_2, visit_3 ])
  });

  it('new state date range is before old state date range', () => {
    const prevState: Visit[] = [ visit_2, visit_3 ];
    const newState: Visit[] = [ visit_0, visit_1 ];
    expect(addNewVisits(prevState, newState)).toEqual([ visit_0, visit_1, visit_2, visit_3 ])
  })
});    

describe('visits reducers', () => {
  it('adds new visits and events on fetch visits success', () => {
    const reducerResult = visitsReducer(oldVisitsState, fetchVisitsSuccess([visit_0]));

    expect(reducerResult.isLoading).toEqual(false);
    expect(reducerResult.events).toEqual(oldEvents.concat([newEvent]));
    expect(reducerResult.visits).toEqual(oldVisits.concat([visit_0]))
  });

  it('changes isLoading to true', () => {
    const startDate = new Date('2019-01-01');
    const endDate = new Date('2019-01-02');
    const reducerResult = visitsReducer(oldVisitsState, fetchVisitsBegin('123123', startDate, endDate));

    expect(reducerResult.isLoading).toEqual(true);
    expect(reducerResult.events).toEqual(oldEvents);
    expect(reducerResult.visits).toEqual(oldVisits)
  });
  it('changes isLoading to false', () => {
    const startDate = new Date('2019-01-01');
    const endDate = new Date('2019-01-02');
    const reducerResult = visitsReducer(oldVisitsState, fetchVisitsError(new Error('no!')));

    expect(reducerResult.isLoading).toEqual(false);
    expect(reducerResult.events).toEqual(oldEvents);
    expect(reducerResult.visits).toEqual(oldVisits)
  });
});
