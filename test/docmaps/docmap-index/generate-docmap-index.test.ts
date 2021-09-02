import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { generateDocmapIndex } from '../../../src/docmaps/docmap-index/generate-docmap-index';

describe('generate-docmap-index', () => {
  it.todo('includes an absolute url for each docmap in the index');

  describe('when no group identifier is supplied', () => {
    it('includes the doi of the hardcoded Review Commons docmap', async () => {
      const result = await pipe(
        { updatedAfter: O.none },
        generateDocmapIndex({
          getAllEvents: T.of([]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          doi: '10.1101/2021.04.25.441302',
        }),
      ]));
    });

    it.todo('includes urls to the NCRC docmaps');
  });

  describe('when passed a group identifier for NCRC', () => {
    it.todo('only returns urls for NCRC docmaps');
  });

  describe('when passed a group identifier for Review Commons', () => {
    it.todo('only returns urls for Review Commons docmaps');
  });

  describe('when passed anything else as the group argument', () => {
    it.todo('returns an empty index');
  });
});
