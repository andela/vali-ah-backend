import faker from 'faker';
import uuid from 'uuid';

import { users } from './users';
import { articles } from './articles';

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
  }
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

const sampleComments = articles.map(({ id: articleId, authorId }) => ({
  id: uuid(),
  content: faker.lorem.sentence(15),
  userId: authorId,
  articleId
}));

const commentVotes = sampleComments.map(({ userId: usersId }, i, array) => ({
  id: uuid(),
  userId: usersId,
  commentId: i > 3 ? array[array.length - 1].id : array[1].id,
  vote: i > 3
}));

const commentDownVotes = sampleComments.map(({ userId: usersId }, i, array) => ({
  id: uuid(),
  userId: usersId,
  commentId: i > 4 ? array[3].id : array[2].id,
  vote: false
}));

const inlineComments = Array(5).fill(0).map(() => ({
  id: uuid(),
  userId,
  content: faker.lorem.sentence(),
  highlightedText: faker.lorem.sentence(),
  startIndex: 4,
  endIndex: 14
}));

export {
  myComments, myArticles, commentVotes, commentDownVotes, sampleComments, inlineComments
};
