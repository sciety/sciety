import request from 'supertest';
import createServer from '../http/server';

describe('index', () => {
  it.skip('redirects to review anchor on article page', async () => {
    const { server } = await createServer();
    const response = await request(server)
      .post('/respond')
      .set('Cookie', 'koa.sess=eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiNDc5OTg1NTkifX0sIl9leHBpcmUiOjE2Mzk2NDYyMTkxNzksIl9tYXhBZ2UiOjMxNTM2MDAwMDAwfQ==; koa.sess.sig=RgE8q0FkaqCqhJ3Y-E3XxHkTDP8;')
      .set('Referer', '/articles/10.1101/blabla')
      .send('reviewid=hypothesis%3A643mSEEaEeu6JufBBcH3cA&command=respond-helpful');

    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/articles/10.1101/blabla#10.1234/5678');
  });
});
