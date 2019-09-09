export interface Event {
	id: string;
	timestamp: string;
	payload: any;
	event_type: string;
};

export interface Visit {
	caregiver_id: string;
	care_recipient_id: string;
  visit_id: string;
  date: string;
	events: Event[]
}
