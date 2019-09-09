import { Visit } from 'common';

export interface ApiCredentials {
	CARE_RECIPIENT_ID: string;
	URL: string;
}

const CARE_RECIPIENT_ID = 'df50cac5-293c-490d-a06c-ee26796f850d';
const URL = 'http://localhost:8000/api/v1/care_recipients';

export async function fetchVisits(timeFrom: Date, timeTo: Date): Promise<Visit[]> {
  return fetch(`${URL}/${CARE_RECIPIENT_ID}/visits/?timeFrom=${timeFrom.toISOString()}&timeTo=${timeTo.toISOString()}`)
    .then(res => res.json())
}