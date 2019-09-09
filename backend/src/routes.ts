import * as express from 'express';
import {
  getVisitByID,
  getEventByID,
  getVisitsForCaregiver,
  getEventsForCaregiver,
  getVisitsForCareRecipient,
  getEventsForCareRecipient,
  getMoodObservationsForCareRecipient
} from './controllers';

import { dbErrorHandler } from './error'; 

const router = express.Router();

router.get('/visits/:visit_id', ... getVisitByID);

router.get('/events/:event_id', ... getEventByID);

router.get('/caregivers/:caregiver_id/visits', ... getVisitsForCaregiver);

router.get('/caregivers/:caregiver_id/events', ... getEventsForCaregiver);

router.get('/care_recipients/:care_recipient_id/visits', ... getVisitsForCareRecipient);

router.get('/care_recipients/:care_recipient_id/events', ... getEventsForCareRecipient);

router.get('/care_recipients/:care_recipient_id/moods', ... getMoodObservationsForCareRecipient);

router.use(dbErrorHandler)

export default router;