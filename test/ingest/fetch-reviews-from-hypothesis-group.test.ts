import * as TE from 'fp-ts/TaskEither';
import { processServer } from '../../src/ingest/fetch-reviews-from-hypothesis-group';
import { arbitraryWord } from '../helpers';

describe('fetch-reviews-from-hypothesis-group', () => {
  describe('when there is one page of annotations', () => {
    it('returns the annotations from that page', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(TE.right({
          rows: [
            {
              id: arbitraryWord(),
              created: arbitraryWord(),
              uri: arbitraryWord(),
            },
            {
              id: arbitraryWord(),
              created: arbitraryWord(),
              uri: arbitraryWord(),
            },
          ],
        }))
        .mockReturnValueOnce(TE.right({
          rows: [],
        }));
      const result = await processServer(arbitraryWord(), fetchData)('medrxiv')();

      expect(result).toHaveLength(2);
    });
  });
});
