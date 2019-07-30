/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import uuid from 'uuid/v4';

export default {
  up: async queryInterface => queryInterface.bulkInsert('Users', [{
    id: uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }], {}),

  down: async queryInterface => queryInterface.bulkDelete('Users', null, {})
};
