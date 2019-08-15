import { Router } from 'express';
import auth from './auth';
import article from './article';
import user from './user';
import comment from './comment';

const router = Router();

router.use('/auth', auth);
router.use('/articles', article);
router.use('/comments', comment);
router.use('/users', user);

export default router;
