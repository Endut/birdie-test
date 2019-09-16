// import { /*Visit,*/ Event } from 'common';

const fakeDB = require('./fakeDB.json');

import { buildQuery, parseEventData, getEvent } from '../src/db';
jest.mock('promise-mysql');
const connection = require('promise-mysql').Connection;


describe('sample test', () => {
	it('should build query string correctly', () => {

		const filterOptions = {
			care_recipient_id: '54818354-8208-4606-90a7-305c317e195e',
			caregiver_id: '4fe5ff14-fea0-498b-9659-fd51ce6c6bce',
			visit_id: '4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			timeFrom: '2019-01-01',
			timeTo: '2019-01-02',
			event_type: 'check_in'
		}

		const expectedValue = `SELECT caregiver_id, visit_id, care_recipient_id, id, payload_as_text, timestamp, event_type, alert_id FROM events WHERE (care_recipient_id = '54818354-8208-4606-90a7-305c317e195e') AND (caregiver_id = '4fe5ff14-fea0-498b-9659-fd51ce6c6bce') AND (visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b4') AND (timestamp >= '2019-01-01') AND (timestamp <= '2019-01-02') AND (event_type = 'check_in') AND (visit_id IS NOT NULL) ORDER BY timestamp ASC;`;
		expect(buildQuery(filterOptions)).toEqual(expectedValue)
	})
});

describe('parse event', () => {
	it('creates event from db row', () => {
		const row = fakeDB[0];

		const eventResult = parseEventData(row);
		expect(eventResult.id).toEqual('50b0aae8-41a7-4a97-a0e9-1a37e37d547f');
		expect(eventResult.timestamp).toEqual('2019-04-23T00:00:00Z');
		expect(eventResult.event_type).toEqual('check_in');
		expect(eventResult.payload.visit_id).toEqual('4d5dd0ad-92d1-4355-ab22-50822ea288b4')

	})
});

describe('calls mysql with appropriate args', () => {
	it('gets event by id with correct args', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547f';
		connection.query.mockImplementation((queryString: string) => {
			return new Promise((resolve) => {
				resolve(queryString)
			});
		});

		await getEvent(id);

		expect(connection.query).toHaveBeenCalledWith(``);

	})
});