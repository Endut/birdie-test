import * as mysql from 'promise-mysql';
import { DB_HOST, DB_TABLE, DB_USER, DB_PASSWORD, DB_NAME } from './config';
import * as _ from 'lodash';
import { DBError } from './error';
import { Event, Visit } from 'common';

// let connection: mysql.Connection;

export interface FilterOptions {
  care_recipient_id?: string,
  caregiver_id?: string,
  visit_id?: string,
  alert_id?: string,
  timeFrom?: string,
  timeTo?: string,
  event_type?: string
}

function combineConditions(conditions: string[]) {
	if (conditions.length === 0) {
		return '';
	} else {
		return 'WHERE ' + conditions[0] + conditions.slice(1).map(condition => ` AND ${condition}`).reduce((a, b) => a + b, '') + ' ';
	}
}

function addFilters(options: FilterOptions): string {
	const conditions: string[] = [];
	if (options.care_recipient_id) {
		conditions.push(mysql.format('(care_recipient_id = ?)', [options.care_recipient_id]));
	}
	if (options.caregiver_id) {
    conditions.push(mysql.format('(caregiver_id = ?)', [options.caregiver_id]));
	}
	if (options.visit_id) {
		conditions.push(mysql.format('(visit_id = ?)', [options.visit_id]));
	}
	if (options.alert_id) {
		conditions.push(mysql.format('(alert_id = ?)', [options.alert_id]));
	}
	if (options.timeFrom) {
		conditions.push(mysql.format('(timestamp >= ?)', [options.timeFrom]));
	}
	if (options.timeTo) {
    conditions.push(mysql.format('(timestamp <= ?)', [options.timeTo]));
  }
  if (options.event_type) {
    conditions.push(mysql.format('(event_type = ?)', [options.event_type]));
  }
  
  conditions.push(`(visit_id IS NOT NULL)`);
  
  return combineConditions(conditions)
}

export function buildQuery(filterOptions?: FilterOptions, order: string = 'ASC'): string {
	let query: string = `SELECT caregiver_id, visit_id, care_recipient_id, id, payload_as_text, timestamp, event_type, alert_id FROM ${DB_TABLE} `;
  if (filterOptions) {
    query += addFilters(filterOptions)
  }
  if (order) {
    query += `ORDER BY timestamp ${order};`
  }
  return query;
}

export function parseEventData(dbRow: any): Event {
	return {
		id: dbRow.id,
		timestamp: dbRow.timestamp,
		event_type: dbRow.event_type,
		payload: JSON.parse(dbRow.payload_as_text)
	}
}

export function getEvent(connection: mysql.Connection, id: string): Promise<Event> {
	const queryString = `SELECT * FROM ${DB_TABLE} WHERE (id = '${id}');`;
  return connection.query(queryString).then(dbRows => {
    if (dbRows.length === 0) {
      throw new DBError('no event data found')
    }
    return parseEventData(dbRows[0])
  })
};

export function getEvents(connection: mysql.Connection, filterOptions: FilterOptions, order: string = 'ASC', ): Promise<Event[]> {
	return connection.query(buildQuery(filterOptions, order))
    .then(dbRows => dbRows.map(parseEventData))
};

export function parseVisitData(dbRows: any[]): Visit {
  const length = dbRows.length;
	if (length === 0) {
		throw new DBError('no visit data found')
	}
  // unfortunately have to sort here because can't find a way to have the database sort varchars that
  // are either +01:00 or Zulu time
  const events = dbRows.map(parseEventData).sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

  const firstEventTime = dbRows[0].timestamp;
	
  return {
		care_recipient_id: dbRows[0].care_recipient_id,
		caregiver_id: dbRows[0].caregiver_id,
    visit_id: dbRows[0].visit_id,
    date: firstEventTime,
    events
  }
}

export async function getVisit(connection: mysql.Connection, visit_id: string): Promise<Visit> {
  return connection.query(buildQuery({ visit_id }))
    .then(parseVisitData)
}

export async function getVisits(connection: mysql.Connection, filterOptions: FilterOptions, order: string = 'ASC' ): Promise<Visit[]> {
  return connection.query(buildQuery(filterOptions, order))
    .then(dbRows => {
      return _.chain(dbRows)
        .groupBy('visit_id')
        .map(parseVisitData)
        .value();
    });
}

export async function createConnection() {
	return mysql.createConnection({
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASSWORD,
    user: DB_USER
  });  
}

export let pool: mysql.Pool;

export async function createPool() {
  return mysql.createPool({
    connectionLimit: 5,
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASSWORD,
    user: DB_USER
  }).then(val => {
    pool = val;
    return pool
  });  
};
