import {
  hasAtLeastOneWorkAsPostedContent,
} from '../../../../src/third-parties/crossref/fetch-all-paper-expression/fetch-all-paper-expressions';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryUri } from '../../../helpers';

describe('has-at-least-one-work-as-posted-content', () => {
  describe('given a set of expressions for a paper', () => {
    describe('when at least one of the expressions in this set has a type of "posted-content"', () => {
      const result = hasAtLeastOneWorkAsPostedContent(
        [
          {
            type: 'posted-content',
            DOI: arbitraryExpressionDoi(),
            posted: {
              'date-parts': [[
                2023,
                5,
                7,
              ]],
            },
            resource: {
              primary: {
                URL: arbitraryUri(),
              },
            },
            relation: {},
          },
          {
            type: 'journal-article',
            DOI: arbitraryExpressionDoi(),
            published: {
              'date-parts': [[
                2023,
                11,
                12,
              ]],
            },
            resource: {
              primary: {
                URL: arbitraryUri(),
              },
            },
            relation: {},
          },
        ],
      );

      it('returns true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('when none of the expressions in this set have a type of "posted-content"', () => {
    it.todo('returns false');
  });
});
