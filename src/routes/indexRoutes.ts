import { Router } from 'express';
import apiRoutes from './api/indexAPI.js';
const router = Router();

router.use('/api', apiRoutes);

export default router;
