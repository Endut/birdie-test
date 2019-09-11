import { Visit } from 'common';

const URL = 'http://localhost:8000/api/v1/care_recipients';

export async function fetchVisits(care_recipient_id: string, timeFrom: Date, timeTo: Date): Promise<Visit[]> {
  return fetch(`${URL}/${care_recipient_id}/visits/?timeFrom=${timeFrom.toISOString()}&timeTo=${timeTo.toISOString()}`)
    .then(res => res.json())
}