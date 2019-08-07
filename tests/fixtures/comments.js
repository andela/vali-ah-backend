import faker from 'faker';
import uuid from 'uuid';

import { users } from './users';

const userId = users[0].id;

const myArticles = [
  {
    id: uuid(),
    authorId: userId,
    title: faker.lorem.sentence(),
    summary: faker.lorem.sentence(),
    body: faker.lorem.text()
  },
  {
    id: uuid(),
    authorId: userId,
    title: faker.lorem.sentence(),
    summary: faker.lorem.sentence(),
    body: faker.lorem.text()
  },
  {
    id: uuid(),
    authorId: userId,
    title: faker.lorem.sentence(),
    summary: faker.lorem.sentence(),
    body: faker.lorem.text()
  },
];

const myComments = [
  {
    id: uuid(),
    userId,
    articleId: myArticles[1].id,
    content: faker.lorem.sentence()
  },
  {
    id: uuid(),
    userId,
    articleId: myArticles[2].id,
    content: faker.lorem.sentence()
  },
  {
    id: uuid(),
    userId,
    articleId: myArticles[2].id,
    content: faker.lorem.sentence()
  }
];

export { myComments, myArticles };
