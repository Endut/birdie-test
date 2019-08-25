import * as mysql from 'promise-mysql';
import { DB_HOST, DB_TABLE, DB_USER, DB_PASSWORD, DB_NAME } from './config';

let connection: mysql.Connection;

export interface FilterOptions {
	care_recipient_id?: string,
	caregiver_id?: string,
	visit_id?: string,
	alert_id?: string,
	timeFrom?: string,
	timeTo?: string,
}

function combineConditions(conditions: string[]) {
	if (conditions.length === 0) {
		return "";
	} else {
		return "WHERE " + conditions[0] + conditions.slice(1).map(condition => ` AND ${condition}`).reduce((a, b) => a + b, "");
	}
}

function addFilters(options: FilterOptions): string {
	const conditions: string[] = [];
	if (options.care_recipient_id) {
		conditions.push(`(care_recipient_id = '${options.care_recipient_id}')`);
	}
	if (options.caregiver_id) {
		conditions.push(`(caregiver_id = '${options.caregiver_id}')`);
	}
	if (options.visit_id) {
		conditions.push(`(visit_id = '${options.visit_id}')`);
	}
	if (options.alert_id) {
		conditions.push(`(alert_id = '${options.alert_id}')`);
	}
	if (options.timeFrom) {
		conditions.push(`(timestamp >= '${options.timeFrom}')`);
	}
	if (options.timeTo) {
    conditions.push(`(timestamp <= '${options.timeTo}')`);
  }
  return combineConditions(conditions)
}

function buildQuery(filterOptions?: FilterOptions): string {
	let query: string = `
SELECT caregiver_id, care_recipient_id, id, payload_as_text, timestamp, event_type, alert_id 
FROM ${DB_TABLE}
`;
	if (filterOptions) {
		query += addFilters(filterOptions)
	}
	console.log(query);
	return query;
}

export interface Event {
	id: string;
	timestamp: string;
	payload: string;
	event_type: string;
};

function parseEventData(dbRows: any[]): Event {
	if (!(dbRows.length > 0)) {
		throw new Error('no event found')
	}
	return {
		id: dbRows[0].id,
		timestamp: dbRows[0].timestamp,
		event_type: dbRows[0].event_type,
		payload: JSON.parse(dbRows[0].payload_as_text)
	}
}

export interface Visit {
	caregiver_id: string;
	care_recipient_id: string;
	events: Event[]
}

function parseVisitData(dbRows: any[]): Visit {
	if (!(dbRows.length > 0)) {
		throw new Error('no visit data found')
	}
	return {
		caregiver_id: dbRows[0].caregiver_id,
		care_recipient_id: dbRows[0].care_recipient_id,
		events: dbRows.map((dbRow) => parseEventData([dbRow]))
	}
}

export async function getVisit(visit_id: string): Promise<Visit> {
	return connection.query(buildQuery({visit_id: visit_id})).then(parseVisitData)
}

export async function getVisits(filterOptions: FilterOptions): Promise<Visit> { 
	return connection.query(buildQuery(filterOptions)).then(parseVisitData)
}

export function getEvent(id: string): Promise<Event> {
	const queryString = `
    SELECT id, timestamp, payload_as_text, event_type, care_recipient_id, caregiver_id
    FROM ${DB_TABLE}
    WHERE (id = '${id}')
    ORDER BY timestamp;
  `;
	return connection.query(queryString).then(parseEventData)
};

export function getEvents(filterOptions: FilterOptions): Promise<Event> {
	return connection.query(buildQuery(filterOptions)).then(parseEventData)
};

export async function createConnection() {
	return mysql.createConnection({
  	host: DB_HOST,
  	user: DB_USER,
  	password: DB_PASSWORD,
  	database: DB_NAME
  })
  .then(val => {
		connection = val;
		return connection
	});
}