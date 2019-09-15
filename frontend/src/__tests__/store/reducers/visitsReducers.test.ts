import { Visit } from 'common';
// import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '../actions/visitActions';
import { addNewVisits, /*visitsReducer */} from '@App/store/reducers/visitsReducers';


// more recent -> older
const visit_0: Visit = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '0',
  date: '2019-05-01',
  events: []
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
    const newState: Visit[] = [ visit_0, visit_1, visit_2, visit_3 ];;
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

// describe('visits reducers', () => {
//   it('')
// });
