import * as express from 'express';
import * as request from 'supertest';
import router from '../src/routes';

const fakeDB = require('./fakeDB.json');

jest.mock('promise-mysql');
const createPool = require('promise-mysql').createPool;

function injectDBResult(fakeResult: any) {
	createPool.mockImplementation((_config: any) => {
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeResult)
			})
		}
		return Promise.resolve({ getConnection: jest.fn(() => Promise.resolve(connection))})
	})
}


import { createPool as initDBConnection, parseEventData } from '../src/db';

const app = express();
app.use(router);

describe('test routes', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('tries to get a visit with badly-formatted uuid', async () => {
		injectDBResult(fakeDB);
		await initDBConnection();
		const res = await request(app)
			.get('/visits/4d5dd0ad-92d1-4355-ab2250822ea288b4')
			
		expect(res.status).toEqual(422);

	});

	it('tries to get a visit with correct uuid', async () => {
		const visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b4'
		injectDBResult(fakeDB.filter((row: any) => row.visit_id === visit_id));
		await initDBConnection();
		const res = await request(app)
			.get(`/visits/${visit_id}`)
		expect(res.status).toEqual(200);
		expect(res.body.visit_id).toEqual(visit_id)
	});

	it('tries to get a visit with incorrect uuid', async () => {
		const visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b5'
		injectDBResult(fakeDB.filter((row: any) => row.visit_id === visit_id));
		await initDBConnection();
		const res = await request(app)
			.get(`/visits/${visit_id}`)
		expect(res.status).toEqual(404);
	});

	it('tries to get an event with correct uuid', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547f'
		injectDBResult(fakeDB.filter((row: any) => row.id === id));
		await initDBConnection();
		const res = await request(app)
			.get(`/events/${id}`)
		expect(res.status).toEqual(200);
		expect(res.body.id).toEqual(id);
	});

	it('tries to get an event with incorrect uuid', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d548f'
		injectDBResult(fakeDB.filter((row: any) => row.id === id));
		await initDBConnection();
		await request(app)
			.get(`/events/${id}`)
			.expect(404);
	});

	it('tries to get an event with badly-formatted uuid', async () => {
		const id = '50b0aae8-41a7-4a97-a0e91a37e37d548f'
		injectDBResult(fakeDB.filter((row: any) => row.id === id));
		await initDBConnection();
		const res = await request(app)
			.get(`/events/${id}`)
		expect(res.status).toEqual(422);
	});

	it('tries to get an event with correct uuid', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547f'
		injectDBResult(fakeDB.filter((row: any) => row.id === id));
		await initDBConnection();
		const res = await request(app)
			.get(`/events/${id}`)
		expect(res.status).toEqual(200);
		const event = parseEventData(fakeDB[0])

		expect(res.body).toEqual(event)
	});

	// most important routes because they are used by frontend, other functionality is duplicated
	it('tries to get events for caregiver', async () => {
		const caregiver_id = '4fe5ff14-fea0-498b-9659-fd51ce6c6bce';
		const timeFrom = '2019-04-23';
		const timeTo = '2019-04-23T03:02:00Z';
		injectDBResult([fakeDB[0], fakeDB[1], fakeDB[2]]);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/caregivers/${caregiver_id}/events/?timeFrom=${timeFrom}&timeTo=${timeTo}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.id)).toEqual([
			'50b0aae8-41a7-4a97-a0e9-1a37e37d547f',
			'3aed2e00-a5f8-40c5-8cfc-f2477f3ea17a',
			'97eab7da-2bb5-4923-852c-8e3e6c6d95d6'
			])
	});

	it('tries to get visits for caregiver', async () => {
		const caregiver_id = '4fe5ff14-fea0-498b-9659-fd51ce6c6bce';
		const timeFrom = '2019-04-23';
		const timeTo = '2019-04-23T03:02:00Z';
		injectDBResult([fakeDB[0], fakeDB[1], fakeDB[2]]);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/caregivers/${caregiver_id}/visits/?timeFrom=${timeFrom}&timeTo=${timeTo}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.visit_id)).toEqual([
			'4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			])
	});

	it('tries to get visits for caregiver with time from filter', async () => {
		const caregiver_id = '4fe5ff14-fea0-498b-9659-fd51ce6c6bce';
		const timeFrom = '2019-04-23';
		injectDBResult(fakeDB);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/caregivers/${caregiver_id}/visits/?timeFrom=${timeFrom}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.visit_id)).toEqual([
			'4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			'fe825de8-4165-4947-a1e5-1d3575f50aa3'
			])
	})

	it('tries to get events for care_recipient with date filter', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-04-23';
		const timeTo = '2019-04-23T03:02:00Z';
		injectDBResult([fakeDB[0], fakeDB[1], fakeDB[2]]);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/events/?timeFrom=${timeFrom}&timeTo=${timeTo}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.id)).toEqual([
			'50b0aae8-41a7-4a97-a0e9-1a37e37d547f',
			'3aed2e00-a5f8-40c5-8cfc-f2477f3ea17a',
			'97eab7da-2bb5-4923-852c-8e3e6c6d95d6'
			])
	});

	it('tries to get visits for care_recipient with date filter', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-04-23';
		const timeTo = '2019-04-23T03:02:00Z';
		injectDBResult([fakeDB[0], fakeDB[1], fakeDB[2]]);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/visits/?timeFrom=${timeFrom}&timeTo=${timeTo}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.visit_id)).toEqual([
			'4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			])
	});

	it('tries to get visits for care_recipient', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-04-23';
		injectDBResult(fakeDB);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/visits/?timeFrom=${timeFrom}`)
		expect(res.status).toEqual(200);
		expect(res.body.map((e: any) => e.visit_id)).toEqual([
			'4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			'fe825de8-4165-4947-a1e5-1d3575f50aa3'
			])
	});

	it('tries to get visits for care_recipient with malformed filters', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-04-23*';
		injectDBResult(fakeDB);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/visits/?timeFrom=${timeFrom}`)
		expect(res.status).toEqual(422);
	});

	it('tries to get visits for care_recipient with malformed filters', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-13-23';
		injectDBResult(fakeDB);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/visits/?timeFrom=${timeFrom}`)
		expect(res.status).toEqual(422);
	});


	it('again tries to get visits for care_recipient with malformed filters', async () => {
		const care_recipient_id = '54818354-8208-4606-90a7-305c317e195e';
		const timeFrom = '2019-02-29';
		injectDBResult(fakeDB);
		await initDBConnection();
		
		const res = await request(app)
			.get(`/care_recipients/${care_recipient_id}/visits/?timeFrom=${timeFrom}`)
		expect(res.status).toEqual(422);
	});











})