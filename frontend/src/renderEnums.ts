interface Lookup {
	[key: string]: string
}

export const EventTypeEmoji: Lookup = {
	'food_intake_observation': ':stew:',
	'fluid_intake_observation': ':cup_with_straw:',
	'regular_medication_taken': ':pill:',
	'task_completed': ':white_check_mark:',
	'task_completion_reverted': ':negative_squared_cross_mark:',
	'general_observation': ':clipboard:',
	'incontinence_pad_observation': ':toilet:',
	'physical_health_observation': ':thermometer:',
	'mental_health_observation': ':pensive:',
	'mood_observation': ':chart_with_upwards_trend:',
	'check_in': ':wave:',
	'check_out': ':wave:',
	'visit_completed': ':house:'
}

export enum MoodEnum {
	sad = -1,
	okay = 0,
	happy = 1
}