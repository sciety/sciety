import { NOT_FOUND, OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';
import communities from '../../src/data/editorial-communities';

describe('community handler', (): void => {
  let response: Response;

  describe('when the community exists', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get(`/communities/${communities[0].id}`);
    });

    it('returns a successful response', async (): Promise<void> => {
      expect(response.status).toBe(OK);
    });

    it('is HTML', async (): Promise<void> => {
      expect(response.type).toBe('text/html');
      expect(response.charset).toBe('utf-8');
    });

    it('has the community name', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('has the community description', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('accelerate'));
    });

    it('has the community article teasers', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('Uncovering'));
      expect(response.text).toStrictEqual(expect.not.stringContaining('Drug-Repurposing'));
    });
  });

  describe('when a different community exists', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get(`/communities/${communities[1].id}`);
    });

    it('has different community article teasers', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('Drug-Repurposing'));
      expect(response.text).toStrictEqual(expect.not.stringContaining('Uncovering'));
    });
  });

  describe('when the community does not exist', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get('/communities/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});
