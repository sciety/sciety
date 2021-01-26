import koaPassport from 'koa-passport';

export const authenticate = koaPassport.authenticate(
  'twitter',
  {
    failureRedirect: '/',
  },
);
