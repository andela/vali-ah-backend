import faker from 'faker';
import uuid from 'uuid';
import randomBool from 'random-bool';
import { generateAuthToken } from '../../src/helpers/auth';

import {
  users
} from './users';

const comment = {
  content: faker.lorem.sentence(),
  userId: faker.random.uuid()
};

const tag = ['motivation', 'health', 'emotion'];

const articles = users.map(({
  id
}) => ({
  id: uuid(),
  authorId: id,
  tag: faker.random.arrayElement(tag),
  title: faker.lorem.sentence(),
  summary: faker.lorem.sentence(),
  slug: faker.lorem.sentence(),
  body: faker.lorem.text(),
  status: 'published'
}));

const followers = users.map(({ id }) => ({
  id: uuid(),
  followeeId: articles[0].authorId,
  followerId: id
}));

const userAuth = generateAuthToken({ id: users[0].id });

const profileData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const category = tag.map(() => ({
  id: uuid(),
  category: faker.random.arrayElement(tag),
  description: faker.lorem.sentence()
}));

const categoriesId = category.map(categoriesTab => categoriesTab.id);
const duplicatedCategoriesId = Array(10)
  .fill(categoriesId)
  .join()
  .split(',');
const usersId = users.map(user => user.id);
const articleIds = articles.map(article => article.id);

const votes1 = articles.map(({
  id
}, index) => ({
  id: uuid(),
  articleId: articleIds[index],
  userId: usersId[Math.floor(Math.random() * 5)],
  upVote: randomBool(),
  num: id
}));

const votes2 = articles.map(({
  id
}, index) => ({
  id: uuid(),
  articleId: articleIds[index],
  userId: usersId[Math.floor(Math.random() * 5)],
  upVote: randomBool(),
  num: id
}));

const votes3 = articles.map(({
  id
}, index) => ({
  id: uuid(),
  articleId: articleIds[index],
  userId: usersId[Math.floor(Math.random() * 5)],
  upVote: randomBool(),
  num: id
}));

const articleCategories = articles.map(({
  id
}, index) => ({
  id: uuid(),
  authorId: usersId[index],
  articleId: id,
  categoryId: faker.random.arrayElement(duplicatedCategoriesId)
}));
const article1 = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences(),
  tag: ['842b0c1e-bd2b-4a4a-82e9-610869f02fd5'],
  authorId: '842b0c1e-bd2b-4a4a-82e9-610869f02fd5'
};

const articleNoTag = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences()
};

const article2 = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences(),
  tag: [
    '842b0c1e-bd2b-4a4a-82e9-610869f02fd4',
    '842b0c1e-bd2b-4a4a-82e9-610869f02fd5',
    '842b0c1e-bd2b-4a4a-82e9-610869f02fd6'
  ]
};

const article3 = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences(),
  tag: ['842b0c1e-bd2b-4a4a-82e9-610869f02fd4', '']
};

const article4 = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences(),
  tag: ['842b0c1e-bd2b-4a4a-82e9-610869f02fd4', '842b0c1e-bd2b-4a4a-82e9-610869f02fd9']
};
const badFollowupIdArticle = {
  title: 'summarysummary',
  summary: 'summarysummary',
  body: faker.lorem.sentences(),
  tag: ['842b0c1e-bd2b-4a4a-82e9-610869f02fd4'],
  followUpId: '842b0c1e-bd2b-4a4a-82e9-610869f02fd5'
};

const votes = articles.map(({ authorId }, i, array) => ({
  id: uuid(),
  userId: authorId,
  articleId: i > 3 ? array[array.length - 1].id : array[1].id,
  upVote: i > 3
}));

const downVotes = articles.map(({
  authorId
}, i, array) => ({
  id: uuid(),
  userId: authorId,
  articleId: i > 4 ? array[3].id : array[2].id,
  upVote: false
}));

const invalidArticleId = '00000000-0000-1000-a000-000000000000';

export {
  comment,
  articles,
  votes,
  invalidArticleId,
  downVotes,
  profileData,
  category,
  articleCategories,
  article1,
  badFollowupIdArticle,
  article2,
  article3,
  article4,
  articleNoTag,
  votes1,
  votes2,
  votes3,
  followers,
  userAuth
};
