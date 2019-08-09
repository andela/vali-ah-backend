import faker from 'faker';
import uuid from 'uuid';
import { users } from './users';

const comment = {
  content: faker.lorem.sentence(),
  userId: faker.random.uuid(),
};

const tag = ['motivation', 'health', 'emotion'];

const articles = users.map(({ id }) => ({
  id: uuid(),
  authorId: id,
  tag: faker.random.arrayElement(tag),
  title: faker.lorem.sentence(),
  summary: faker.lorem.sentence(),
  body: faker.lorem.text()
}));

const profileData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const category = tag.map(() => ({
  id: uuid(),
  category: faker.random.arrayElement(tag),
  description: faker.lorem.sentence(),
}));

const categoriesId = category.map(categoriesTab => categoriesTab.id);
const duplicatedCategoriesId = Array(6).fill(categoriesId).join().split(',');
const usersId = users.map(user => user.id);

const articleCategories = articles.map(({ id }) => ({
  id: uuid(),
  authorId: faker.random.arrayElement(usersId),
  articleId: id,
  categoryId: faker.random.arrayElement(duplicatedCategoriesId),
}));


export {
  comment,
  articles,
  category,
  articleCategories,
  profileData
};
