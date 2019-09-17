// import { /*Visit,*/ Event } from 'common';

const fakeDB = require('./fakeDB.json');

import { buildQuery, parseEventData, parseVisitData, getEvent, getVisit, getVisits } from '../src/db';
import * as mysql from 'promise-mysql';
import { DBError } from '../src/error';

describe('query builder tests', () => {
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
		expect(eventResult.timestamp).toEqual('2019-04-23T01:00:00Z');
		expect(eventResult.event_type).toEqual('check_in');
		expect(eventResult.payload.visit_id).toEqual('4d5dd0ad-92d1-4355-ab22-50822ea288b4')

	})
});

describe('parse visit', () => {
	it('creates visit from db rows', () => {
		const rows = [
			fakeDB[0],
			fakeDB[1],
			fakeDB[2]
		];

		const visitResult = parseVisitData(rows);
		expect(visitResult.visit_id).toEqual('4d5dd0ad-92d1-4355-ab22-50822ea288b4');
		expect(visitResult.caregiver_id).toEqual('4fe5ff14-fea0-498b-9659-fd51ce6c6bce')
		expect(visitResult.date).toEqual('2019-04-23T01:00:00Z');
		expect(visitResult.events.length).toEqual(3);
		expect(visitResult.events.map(event => event.timestamp)).toEqual([
			'2019-04-23T01:00:00Z',
			'2019-04-23T01:01:00Z',
			'2019-04-23T02:02:00+01:00'
			])
	})
});

describe('getEvent calls mysql with appropriate args', () => {
	it('gets event by id with correct args', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547f';
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeDB.filter((row: any) => row.id === id))
			})
		}
		await getEvent(connection as unknown as mysql.Connection, id);

		expect(connection.query).toHaveBeenCalledWith(`SELECT * FROM events WHERE (id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547f');`);

	});

	it('getEvent throws error when nothing found', async () => {
		const id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547g';
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeDB.filter((row: any) => row.id === id))
			})
		}

		await expect(getEvent(connection as unknown as mysql.Connection, id)).rejects.toThrow(DBError);

		expect(connection.query).toHaveBeenCalledWith(`SELECT * FROM events WHERE (id = '50b0aae8-41a7-4a97-a0e9-1a37e37d547g');`);

	});

	it('getVisit gets visit by visit_id with correct args', async () => {
		const visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b4';
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeDB.filter((row: any) => row.visit_id === visit_id))
			})
		}
		await getVisit(connection as unknown as mysql.Connection, visit_id);

		expect(connection.query).toHaveBeenCalledWith(`SELECT caregiver_id, visit_id, care_recipient_id, id, payload_as_text, timestamp, event_type, alert_id FROM events WHERE (visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b4') AND (visit_id IS NOT NULL) ORDER BY timestamp ASC;`);
	});
	
	it('getVisit throws error when no visit found', async () => {
		const visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b5';
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeDB.filter((row: any) => row.visit_id === visit_id))
			})
		}
		await expect(getVisit(connection as unknown as mysql.Connection, visit_id)).rejects.toThrow(DBError);

		expect(connection.query).toHaveBeenCalledWith(`SELECT caregiver_id, visit_id, care_recipient_id, id, payload_as_text, timestamp, event_type, alert_id FROM events WHERE (visit_id = '4d5dd0ad-92d1-4355-ab22-50822ea288b5') AND (visit_id IS NOT NULL) ORDER BY timestamp ASC;`);
	});

	it('getVisits filters correctly', async () => {
		const timeFrom = '2019-04-23';
		const timeTo = '2019-04-24';
		const timeFromDate = new Date(timeFrom);
		const timeToDate = new Date(timeTo);
		const connection = {
			query: jest.fn((_queryString: string) => {
				return Promise.resolve(fakeDB.filter((row: any) => {
						const date = new Date(row.timestamp);
						return (date >= timeFromDate) && (date <= timeToDate)
					}))
			})
		};
		// don't really need to test the correctness of the query (this is tested by query builder tests),
		// just need to check that getVisits groups and processes the rows correctly
		const visitsResult = await getVisits(connection as unknown as mysql.Connection, { timeFrom, timeTo });
		expect(visitsResult.length).toEqual(2);
		expect(visitsResult.map(v => v.date)).toEqual([
			'2019-04-23T01:00:00Z',
			'2019-04-23T00:03:00Z'
			]);
		expect(visitsResult.map(v => v.visit_id)).toEqual([
			'4d5dd0ad-92d1-4355-ab22-50822ea288b4',
			'fe825de8-4165-4947-a1e5-1d3575f50aa3'
			]);
	})

});