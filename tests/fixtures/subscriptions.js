import uuid from 'uuid/v4';

import { users } from './users';
import { articleCategories, articles } from './articles';

const subscriptions = articleCategories.map(({ categoryId }) => ({
  id: uuid(),
  userId: users[0].id,
  categoryId
}));

const user = users[0];

export {
  subscriptions, articles, user, articleCategories
};
