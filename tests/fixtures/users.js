import faker from 'faker';
import uuid from 'uuid';
import { generateAuthToken } from '../../src/helpers/auth';

const user = {
  firstName: 'gilbert',
  lastName: 'erick',
  userName: 'erickBlaze',
  email: 'gillberto5@gmail.com',
  password: 'gillberto5',
};

const sameUserName = {
  firstName: 'gilbert',
  lastName: 'erick',
  userName: 'erickBlaze',
  email: 'gillberto55@gmail.com',
  password: 'gillberto5',
};

const user2 = {
  firstName: 'gilbert',
  lastName: 'erick',
  userName: 'erickBlazee',
  email: 'gillberto55@gmail.com',
  password: 'gillberto5',
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
  password: 'password123',
};

const undefinedFirstName = {
  firstName: '',
  lastName: 'v',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123',
};

const undefinedLastName = {
  firstName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123',
};

const shortLastName = {
  firstName: 'vali',
  lastName: 'v',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123',
};

const invalidLastName = {
  firstName: 'vali',
  lastName: 'v@',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'password123',
};

const shortUsername = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'v',
  email: 'vali@gandela.com',
  password: 'password123',
};

const invalidEmail = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'vali',
  email: 'vali.com',
  password: 'password123',
};

const shortPassword = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'pa',
};

const invalidPassword = {
  firstName: 'vali',
  lastName: 'vali',
  userName: 'teamVali',
  email: 'vali@gandela.com',
  password: 'passwordui',
};

const users = Array(10)
  .fill(0)
  .map(() => ({
    id: uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));

const userToken = generateAuthToken({ id: users[0].id });
const userOneToken = generateAuthToken({ id: users[1].id });
const randomUserToken = generateAuthToken({ id: uuid() });

const usersWithFollowing = users.map(({ id }) => ({
  followeeId: users[0].id,
  followerId: id,
  active: true,
}));
const profileId = '94189e3d-0379-4dd2-b03d-73fa8c14b3ab';

const profileData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const usersignUpdetail = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const usersignUpdetail2 = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
const usersignUpdetail3 = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName({ min: 2, max: 10 }).slice(0, 19),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
const profiledataForLowerCase = {
  firstName: 'hearT',
  email: 'PETERchuKS@gmail.com',
  userName: 'lovIngYOU',
};

const invalidUserId = 'a7b039e8-bae4-11e9-a2a3-2a2ae2dbcce4';

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
  profileData,
  usersignUpdetail,
  profileId,
  user,
  user2,
  anotherUser,
  users,
  userToken,
  randomUserToken,
  usersWithFollowing,
  profiledataForLowerCase,
  invalidUserId,
  sameUserName,
  userOneToken,
  usersignUpdetail2,
  usersignUpdetail3,
};
