import { Middleware } from 'koa';

export const logOut: Middleware = async (context, next) => {
  context.logout();
  if (process.env.AUTHENTICATION_STRATEGY === 'auth0') {
    const domain = process.env.AUTH0_DOMAIN ?? '';
    const clientId = process.env.AUTH0_CLIENT_ID ?? '';
    const app = process.env.APP_ORIGIN ?? '';
    const auth0logout = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${app}/`;
    context.redirect(auth0logout);
  } else {
    context.redirect('back');
  }

  await next();
};
