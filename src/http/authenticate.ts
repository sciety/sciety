import koaPassport from 'koa-passport';

export const authenticate = koaPassport.authenticate(
  'local',
  {
    failureRedirect: '/',
  },
);
