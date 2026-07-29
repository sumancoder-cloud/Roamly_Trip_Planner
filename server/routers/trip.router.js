import express from 'express';
import { generateTrip } from '../services/ai.service.js';
import { validateGenerateRequest, validateRefineRequest } from '../schemas/trip.schema.js';

const router = express.Router();

router.post('/generate', (req, res) => {
  const validation = validateGenerateRequest({ prompt: req.body?.prompt });
  if (!validation.success) {
    return res.json({ success: false, error: { code: 'INVALID_INPUT', message: validation.error.issues[0]?.message || 'Invalid input' } });
  }

  generateTrip(req.body.prompt).then((result) => res.json(result));
});

router.post('/refine', (req, res) => {
  const validation = validateRefineRequest({ trip: req.body?.trip, instruction: req.body?.instruction });
  if (!validation.success) {
    return res.json({ success: false, error: { code: 'INVALID_INPUT', message: validation.error.issues[0]?.message || 'Invalid input' } });
  }

  res.json({ success: true, trip: req.body.trip });
});

export default router;
