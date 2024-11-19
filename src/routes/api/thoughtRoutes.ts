import { Router } from 'express';
const router = Router();

import { getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, createReaction, deleteReaction
} from '../../controllers/thoughtController.js';

router.route('/').get(getAllThoughts).post(createThought);

router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

router.route('/:thoughtsId/reactions').post(createReaction)

router.route('/:thoughtsId/reactions/:reactionId').delete(deleteReaction)

export { router as thoughtRouter }

