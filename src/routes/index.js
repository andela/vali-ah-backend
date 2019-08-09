import { Router } from 'express';
import auth from './auth';
import article from './article';
import user from './user';

const router = Router();

router.use('/auth', auth);
router.use('/articles', article);
router.use('/users', user);

export default router;
