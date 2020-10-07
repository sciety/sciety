import { Result } from 'true-myth';
import createAddHardcodedBiorxivVersion1Event from '../../src/article-page/add-hardcoded-biorxiv-version-1-event';
import Doi from '../../src/types/doi';

describe('add-hardcoded-biorxiv-version-1-event', () => {
  it('adds a version 1 event to all articles', async () => {
    const decorator = createAddHardcodedBiorxivVersion1Event(
      async () => [],
      async () => Result.ok({
        publicationDate: new Date('2020-01-02'),
      }),
    );

    const feedEvents = await decorator(new Doi('10.1101/12345678'));

    expect(feedEvents[0]).toMatchObject({
      type: 'article-version',
      version: 1,
    });
  });
});
