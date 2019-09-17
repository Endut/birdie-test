import { Request, Response, NextFunction } from 'express';
import { Event, Visit } from 'common'; 
import { getVisit, getVisits, getEvent, getEvents, pool } from './db';
import { check, validationResult } from 'express-validator';

function invalidInputHandler(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    return next()
  }
};

function asyncHandler (fn: (req: Request, res: Response, next: NextFunction) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const getVisitByID = [
  check('visit_id').isUUID(),

  invalidInputHandler,
  
  asyncHandler(async (req: Request, res: Response) => {
    const { visit_id } = req.params;

    const visit: Visit = await getVisit(await pool.getConnection(), visit_id);
    return res.status(200).json(visit);
  })
];

export const getEventByID = [
  check('event_id').isUUID(),
  
  invalidInputHandler,
  
  asyncHandler(async (req: Request, res: Response) => {
    const { event_id } = req.params;

    const event: Event = await getEvent(await pool.getConnection(), event_id);
    return res.status(200).json(event);
  })
];

export const getVisitsForCaregiver = [
  check('caregiver_id').isUUID(),
  check('alert_id').optional().isUUID(),
  check('visit_id').optional().isUUID(),
  check('timeTo').optional().isISO8601({ strict: true }),
  check('timeFrom').optional().isISO8601({ strict: true }),

  invalidInputHandler,

  asyncHandler(async (req: Request, res: Response) => {
    const { caregiver_id } = req.params;
    const { visit_id, alert_id, timeTo, timeFrom } = req.query;

    const visits: Visit[] = await getVisits(await pool.getConnection(), { caregiver_id, visit_id, alert_id, timeTo, timeFrom });
    return res.status(200).json(visits);
  })
];

export const getEventsForCaregiver = [
  check('caregiver_id').isUUID(),
  check('alert_id').optional().isUUID(),
  check('visit_id').optional().isUUID(),
  check('timeTo').optional().isISO8601({ strict: true }),
  check('timeFrom').optional().isISO8601({ strict: true }),

  invalidInputHandler,

  asyncHandler(async (req: Request, res: Response) => {
    const { caregiver_id } = req.params;
    const { alert_id, visit_id, timeTo, timeFrom } = req.query;

    const events: Event[] = await getEvents(await pool.getConnection(), { caregiver_id, alert_id, visit_id, timeTo, timeFrom });
    return res.status(200).json(events);
  })
];

export const getVisitsForCareRecipient = [
  check('care_recipient_id').isUUID(),
  check('caregiver_id').optional().isUUID(),
  check('alert_id').optional().isUUID(),
  check('visit_id').optional().isUUID(),
  check('timeTo').optional().isISO8601({ strict: true }),
  check('timeFrom').optional().isISO8601({ strict: true }),

  invalidInputHandler,

  asyncHandler(async (req: Request, res: Response) => {
    const { care_recipient_id } = req.params;
    const { caregiver_id, visit_id, alert_id, timeTo, timeFrom } = req.query;

    const visits: Visit[] = await getVisits(await pool.getConnection(), { care_recipient_id, caregiver_id, visit_id, alert_id, timeTo, timeFrom }, );
    return res.status(200).json(visits);
  })
]

export const getEventsForCareRecipient = [
  check('care_recipient_id').isUUID(),
  check('caregiver_id').optional().isUUID(),
  check('alert_id').optional().isUUID(),
  check('visit_id').optional().isUUID(),
  check('timeTo').optional().isISO8601({ strict: true }),
  check('timeFrom').optional().isISO8601({ strict: true }),
  
  invalidInputHandler,

  asyncHandler(async (req: Request, res: Response) => {
    const { care_recipient_id } = req.params;
    const { caregiver_id, alert_id, visit_id, timeTo, timeFrom } = req.query;

    const events: Event[] = await getEvents(await pool.getConnection(), { care_recipient_id, caregiver_id, alert_id, visit_id, timeTo, timeFrom });
    return res.status(200).json(events);
  })
];

export const getMoodObservationsForCareRecipient = [
  check('care_recipient_id').isUUID(),
  check('timeTo').optional().isISO8601({ strict: true }),
  check('timeFrom').optional().isISO8601({ strict: true }),

  invalidInputHandler,

  asyncHandler(async (req: Request, res: Response) => {
    const { care_recipient_id } = req.params;
    const { timeTo, timeFrom } = req.query;
    const event_type = 'mood_observation';

    const events: Event[] = await getEvents(await pool.getConnection(), { care_recipient_id, timeTo, timeFrom, event_type });
    return res.status(200).json(events);
  })
];
