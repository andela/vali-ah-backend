import { Router } from 'express';
import auth from './auth';
import article from './article';


const router = Router();

router.use('/auth', auth);
router.use('/articles', article);

export default router;
