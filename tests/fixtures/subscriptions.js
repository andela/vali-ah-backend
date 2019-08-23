import uuid from 'uuid/v4';
import faker from 'faker';

import { users } from './users';
import { articleCategories, articles } from './articles';

const subscriptions = articleCategories.map(({ categoryId }) => ({
  id: uuid(),
  userId: users[0].id,
  categoryId
}));

const user = users[0];

const tags = [
  'motivation',
  'health',
  'emotion',
  'stress management',
  'time management',
  'productivity',
  'wealth management',
  'emotional intelligence',
  'relationships'
];

const bulkCategories = tags.map(tag => ({
  id: uuid(),
  category: tag,
  description: faker.lorem.sentence(5)
}));

export {
  subscriptions, articles, user, articleCategories, bulkCategories
};
