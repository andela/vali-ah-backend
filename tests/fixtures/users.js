const user = {
  firstName: 'gilbert',
  lastName: 'erick',
  userName: 'erickBlaze',
  email: 'gillberto5@gmail.com',
  password: 'hotgirls2real'
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
  username: 'teamVali',
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
  user
};
