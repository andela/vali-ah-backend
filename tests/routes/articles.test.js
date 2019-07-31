/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import uuid from 'uuid';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import app from '../../src';
import models from '../../src/models';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

const { Articles, Users } = models;
const baseRoute = '/api/v1';

const commentData = {
  content: faker.lorem.sentences(),
  userId: faker.random.uuid(),
};

describe('Articles API', () => {
  describe('POST /articles/:article/comment', () => {
    let articles;
    before(async () => {
      const users = await Users.bulkCreate(Array(2).fill(0).map(() => ({
        id: uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })), { returning: true });

      articles = await Articles.bulkCreate(users.map(({ id }) => ({
        id: uuid(),
        authorId: id,
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentences(),
        body: faker.lorem.text()
      })), { returning: true });
    });

    it('should return 201', async () => {
      const { status } = await chai.request(app).post(`${baseRoute}/articles/${articles[0].id}/comments`).send(commentData);

      status.should.eql(201);
    });

    it('should return 400', async () => {
      const { status } = await chai.request(app).post(`${baseRoute}/articles/${articles[0].id}/comments`).send({});

      status.should.eql(400);
    });
  });
});
