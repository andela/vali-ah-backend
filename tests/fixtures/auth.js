export const facebookFirstCallResponse = {
  access_token: '472743220180658|Ybiad9C30YZmY42mAWU0zFzgZkM',
  token_type: 'bearer'
};

export const facebookSecondCallErrorResponse = {
  error: { code: 190, message: 'Invalid OAuth access token.' },
  is_valid: false,
  scopes: []
};

export const facebookSecondCallInvalidToken = {
  app_id: '472743220180658',
  type: 'USER',
  application: '1KBideas',
  data_access_expires_at: 1572431366,
  error: {
    code: 190,
    message:
      'Error validating access token: Session has expired on Wednesday, 31-Jul-19 09:00:00 PDT. The current time is Thursday, 01-Aug-19 04:37:07 PDT.',
    subcode: 463
  },
  expires_at: 1564588800,
  is_valid: false,
  scopes: ['email', 'public_profile'],
  user_id: '113162880017471'
};

export const facebookSecondCallSuccessResponse = {
  app_id: '472743220180658',
  type: 'USER',
  application: '1KBideas',
  data_access_expires_at: 1572426016,
  expires_at: 1564657200,
  is_valid: true,
  scopes: ['email', 'public_profile'],
  user_id: '113162880017471'
};

export const facebookThirdCallSuccessResponse = {
  id: '113162880017471',
  first_name: 'Vali',
  last_name: 'Odin',
  email: 'vali.1kbdeas@gmail.com',
  picture: {
    data: {
      height: 50,
      is_silhouette: true,
      url:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=113162880017471&height=50&width=50&ext=1567242018&hash=AeRqi78pNib3qMsj',
      width: 50
    }
  }
};

export const googleSuccessResponse = {
  iss: 'accounts.google.com',
  azp: '299133803056-7usd50plt3ta1ca0li6ukfa0cnrd570t.apps.googleusercontent.com',
  aud: '299133803056-7usd50plt3ta1ca0li6ukfa0cnrd570t.apps.googleusercontent.com',
  sub: '110543582300210237207',
  email: 'vali.1kbdeas@gmail.com',
  email_verified: true,
  at_hash: '39l4dQwtYNkiANhV7qXzSg',
  name: 'Vali 1kbdeas',
  picture:
    'https://lh3.googleusercontent.com/--zZ-BKGCmcg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reUtl2M5uCnSswx3gFDQcY4tFBi-Q/s96-c/photo.jpg',
  given_name: 'Vali',
  family_name: '1kbdeas',
  locale: 'en',
  iat: 1564660802,
  exp: 1564664402,
  jti: '7cbbe1aae67f1ac22eb643575b7219ebd4ff1123'
};

export const userProfileDetails = {
  username: 'ibukun',
  displayName: 'ibukun adeeko',
  emails: [{ value: 'vali@email.com' }],
  photos: [{ value: 'someimagestring' }]
};

export const extractedUserDetails = {
  userName: 'username',
  firstName: 'first',
  lastName: 'last',
  email: 'email@email.com',
  avatarUrl: 'urlstring'
};
