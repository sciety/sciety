import request from 'supertest';
import createServer from './server';

describe('unathenticated-response', () => {
  describe('when the user has logged in immediately after responding helpful', () => {
    it.skip('executes the command', async () => {
      const { server, adapters } = await createServer();
      // const cookieHeader = 'koa.sess=...=; cookieconsent_status=dismiss; koa.sess.sig=...';
      const response = await request(server).get('/twitter/callback?oauth_token=INI0LQAAAAABG9hIAAABdlGQoZ0&oauth_verifier=IU6MzfaaHCrobqKvHUvBcTCtC8E3lCAt');

      expect(response.status).toBe(302);

      await adapters.getAllEvents();
      // TODO: mock the authentication
      // TODO: expect a new event appears
      // TODO: add to the session a command that should have been previously stored, similar to /follow
    });
  });
});
