import { runSaga, Saga } from 'redux-saga';
import { AnyAction } from 'redux';
import { setStartDate, setEndDate } from '@App/store/actions/dateActions';
import { setCareRecipient } from '@App/store/actions/careRecipientActions';
import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '@App/store/actions/visitActions';
import { fetchVisitsTask, parseDatesAndFetch } from '@App/store/sagas/sagas';


jest.mock('@App/api');
const fetchVisits = require('@App/api').fetchVisits; 

jest.mock('@App/store/selectors');
const getVisitsLimits = require('@App/store/selectors').getVisitsLimits;
const getCareRecipient = require('@App/store/selectors').getCareRecipient;

const mockVisitData = {
  care_recipient_id: '123123',
  caregiver_id: '321321',
  visit_id: '22223',
  date: '2019-05-10T18:56:57.193Z',
  events: []
};

async function recordSaga(saga: Saga, initialAction: AnyAction) {
  const dispatched: AnyAction[] = [];
  await runSaga(
    {
      dispatch: (action: AnyAction) => dispatched.push(action),
      getState: () => ({})
    },
    saga,
    initialAction
  ).toPromise();
  return dispatched
}

describe('async actions', async () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates FETCH_VISITS_SUCCESS after fetchVisitsTask has been run', async () => {

    const careRecipient = '123123';
    fetchVisits.mockImplementation(
      (care_recipient_id: string, startDate: Date, endDate: Date) => 
        new Promise((resolve, reject) => resolve([mockVisitData])));

    const endDate = new Date('2019-05-11');
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 1);

    const dispatched = await recordSaga(fetchVisitsTask, fetchVisitsBegin('123123', startDate, endDate))
    expect(fetchVisits).toHaveBeenCalledWith(careRecipient, startDate, endDate);
    expect(dispatched).toEqual([setCareRecipient(careRecipient), fetchVisitsSuccess([mockVisitData])]);
  });

  it('creates FETCH_VISITS_ERROR after fetchVisitsTask has been run but with bad params', async () => {

    const careRecipient = '123124';
    fetchVisits.mockImplementation(
      (care_recipient_id: string, startDate: Date, endDate: Date) => 
        new Promise((resolve, reject) => reject(new Error('no'))));

    const endDate = new Date('2019-05-11');
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 1);

    const dispatched = await recordSaga(fetchVisitsTask, fetchVisitsBegin(careRecipient, startDate, endDate))
    expect(fetchVisits).toHaveBeenCalledWith(careRecipient, startDate, endDate);
    expect(dispatched).toEqual([setCareRecipient(careRecipient), fetchVisitsError(new Error('no'))]);
  });

  it('dispatches a FETCH_VISITS_BEGIN when end date is older than the oldest visit in the state', async () => {
    const oldStartDate = new Date('2019-05-08');
    const oldEndDate = new Date('2019-05-09');
    
    getVisitsLimits.mockImplementation((state: any) => ({ oldStartDate: oldStartDate, oldEndDate: oldEndDate }));
    getCareRecipient.mockImplementation((state: any) => '123123');
    
    // const newStartDate = new Date('2019-05-09');
    const newEndDate = new Date('2019-05-11');

    fetchVisits.mockImplementation(
      (care_recipient_id: string, startDate: Date, endDate: Date) => 
        new Promise((resolve, reject) => resolve([mockVisitData])));

    const dispatched = await recordSaga(parseDatesAndFetch, setEndDate(newEndDate));
    expect(dispatched).toEqual([fetchVisitsBegin('123123', oldEndDate, newEndDate)])
  });

  it('does NOT dispatch a FETCH_VISITS_BEGIN when new end date is not older than the oldest visit in the state', async () => {
    const oldStartDate = new Date('2019-05-08');
    const oldEndDate = new Date('2019-05-09');
    const newEndDate = new Date('2019-05-09');
    
    getVisitsLimits.mockImplementation((state: any) => ({ oldStartDate: oldStartDate, oldEndDate: oldEndDate }));
    getCareRecipient.mockImplementation((state: any) => '123123');
    
    fetchVisits.mockImplementation(
      (care_recipient_id: string, startDate: Date, endDate: Date) => 
        new Promise((resolve, reject) => resolve([mockVisitData])));

    const dispatched = await recordSaga(parseDatesAndFetch, setEndDate(newEndDate));
    expect(dispatched).not.toEqual([fetchVisitsBegin('123123', oldEndDate, newEndDate)])
  });

  it('dispatches a FETCH_VISITS_BEGIN when start date is earlier than the earliest visit in the state', async () => {
    const oldStartDate = new Date('2019-05-08');
    const oldEndDate = new Date('2019-05-09');
    const newStartDate = new Date('2019-05-07');
    
    getVisitsLimits.mockImplementation((state: any) => ({ oldStartDate: oldStartDate, oldEndDate: oldEndDate }));
    getCareRecipient.mockImplementation((state: any) => '123123');
    
    const dispatched = await recordSaga(parseDatesAndFetch, setStartDate(newStartDate));
    expect(dispatched).toEqual([fetchVisitsBegin('123123', newStartDate, oldStartDate)])
  });

  it('does NOT dispatch a FETCH_VISITS_BEGIN when new end date is not older than the oldest visit in the state', async () => {
    const oldStartDate = new Date('2019-05-08');
    const oldEndDate = new Date('2019-05-09');
    const newStartDate = new Date('2019-05-08');
    
    getVisitsLimits.mockImplementation((state: any) => ({ oldStartDate: oldStartDate, oldEndDate: oldEndDate }));
    getCareRecipient.mockImplementation((state: any) => '123123');
    
    const dispatched = await recordSaga(parseDatesAndFetch, setStartDate(newStartDate));
    expect(dispatched).not.toEqual([fetchVisitsBegin('123123', newStartDate, oldStartDate)])
  });
})