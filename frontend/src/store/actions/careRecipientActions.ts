export const SET_CARE_RECIPIENT = 'SET_CARE_RECIPIENT';

export const setCareRecipient = (care_recipient_id: string) => ({
	type: SET_CARE_RECIPIENT,
	payload: care_recipient_id,
});
