import { Router } from 'express';
import auth from './auth';
import article from './article';
import user from './user';
import comment from './comment';
import author from './author';

const router = Router();

router.use('/auth', auth);
router.use('/articles', article);
router.use('/comments', comment);
router.use('/users', user);
router.use('/authors', author);

export default router;
