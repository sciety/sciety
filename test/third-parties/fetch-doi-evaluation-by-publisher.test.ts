import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';

import { fetchDoiEvaluationByPublisher } from '../../src/third-parties/fetch-doi-evaluation-by-publisher';

import { Evaluation } from '../../src/types/evaluation';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../helpers';

const arbitraryEvaluation: Evaluation = {
  fullText: arbitrarySanitisedHtmlFragment(),
  url: new URL(arbitraryUri()),
};

describe('fetch-doi-evaluation-by-publisher', () => {
  describe('when a doi with a configured prefix is passed in', () => {
    describe('when the delegated doi fetcher returns a right', () => {
      const result = fetchDoiEvaluationByPublisher({
        doiPrefix: () => TE.right(arbitraryEvaluation),
      });

      it.skip('returns a right', () => {
        expect(result).toStrictEqual(E.right);
      });
    });

    describe('when the delegated doi fetcher returns a left', () => {
      it.todo('returns a left');
    });
  });

  describe('when a doi with an unknown prefix is passed in', () => {
    it.todo('returns unavailable');
  });
});
