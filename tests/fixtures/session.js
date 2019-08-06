import faker from 'faker';

export const sessions = Array(10).fill(0).map(() => ({
  event: 'newPublication',
  userId: faker.random.uuid(),
  email: faker.internet.email(),
  payload: {
    event: 'newPublication',
    email: faker.internet.email(),
    articleId: faker.random.uuid(),
    firstName: faker.name.firstName(),
    title: faker.lorem.sentence(),
    sessionId: faker.random.uuid()
  }
}));

export const userSessions = {};
