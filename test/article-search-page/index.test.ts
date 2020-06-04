import request, { Response } from 'supertest';
import createServer from '../handlers/server';

const arbitraryDoi = '10.1101/833392';

describe('article search route', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = createServer();
    response = await request(server).get(`/articles?query=${arbitraryDoi}`);
  });

  it('displays search results', async (): Promise<void> => {
    expect(response.text).toStrictEqual(expect.stringContaining('Search results'));
  });
});
