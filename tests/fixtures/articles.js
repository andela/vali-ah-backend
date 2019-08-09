import faker from 'faker';
import uuid from 'uuid';

import { users } from './users';

const comment = {
  content: faker.lorem.sentence(),
  userId: faker.random.uuid(),
};

const articles = users.map(({ id }) => ({
  id: uuid(),
  authorId: id,
  title: faker.lorem.sentence(),
  summary: faker.lorem.sentences(),
  body: faker.lorem.text()
}));

const profileData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};
export { comment, articles, profileData };
