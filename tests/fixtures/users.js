import faker from 'faker';
import uuid from 'uuid';

const user = {
  firstName: 'gilbert',
  lastName: 'erick',
  userName: 'erickBlaze',
  email: 'gillberto5@gmail.com',
  password: 'gillberto5'
};

const anotherUser = {
  firstName: 'Foo',
  lastName: 'Baz',
  userName: 'foofoo',
  email: 'foobar@fakemail.com',
  password: 'foobarjdb34',
};

const invalidFirstName = {
  firstName: 'vali@',
  lastName: 'v',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123'
};

const undefinedFirstName = {
  firstName: '',
  lastName: 'v',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123'
};

const undefinedLastName = {
  firstName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123'
};

const shortLastName = {
  firstName: 'vali',
  lastName: 'v',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123'
};

const invalidLastName = {
  firstName: 'vali',
  lastName: 'v@',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123'
};

const shortUsername = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'v',
  email: 'vali@gandela.com',
  password: 'password123'
};

const invalidEmail = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'vali',
  email: 'vali.com',
  password: 'password123'
};

const shortPassword = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'pa'
};

const invalidPassword = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'passwordui'
};

const users = Array(2).fill(0).map(() => ({
  id: uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}));

export {
  invalidFirstName,
  shortLastName,
  undefinedLastName,
  undefinedFirstName,
  invalidLastName,
  shortUsername,
  invalidEmail,
  shortPassword,
  invalidPassword,
  user,
  anotherUser,
  users
};
