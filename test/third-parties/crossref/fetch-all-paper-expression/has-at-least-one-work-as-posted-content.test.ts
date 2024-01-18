import {
  hasAtLeastOneWorkAsPostedContent,
} from '../../../../src/third-parties/crossref/fetch-all-paper-expression/fetch-all-paper-expressions';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryNumber, arbitraryUri } from '../../../helpers';
import { CrossrefWork } from '../../../../src/third-parties/crossref/fetch-all-paper-expression/crossref-work';

const arbitraryPostedContent = (): CrossrefWork => ({
  type: 'posted-content',
  DOI: arbitraryExpressionDoi(),
  posted: {
    'date-parts': [[
      arbitraryNumber(2000, 2023),
      arbitraryNumber(0, 11),
      arbitraryNumber(1, 27),
    ]],
  },
  resource: {
    primary: {
      URL: arbitraryUri(),
    },
  },
  relation: {},
});

const arbitraryJournalArticle = (): CrossrefWork => ({
  type: 'journal-article',
  DOI: arbitraryExpressionDoi(),
  published: {
    'date-parts': [[
      arbitraryNumber(2000, 2023),
      arbitraryNumber(0, 11),
      arbitraryNumber(1, 27),
    ]],
  },
  resource: {
    primary: {
      URL: arbitraryUri(),
    },
  },
  relation: {},
});

describe('has-at-least-one-work-as-posted-content', () => {
  describe('given a set of expressions for a paper', () => {
    describe('when at least one of the expressions in this set has a type of "posted-content"', () => {
      const result = hasAtLeastOneWorkAsPostedContent(
        [
          arbitraryPostedContent(),
          arbitraryJournalArticle(),
        ],
      );

      it('returns true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('when none of the expressions in this set have a type of "posted-content"', () => {
    const result = hasAtLeastOneWorkAsPostedContent(
      [
        arbitraryJournalArticle(),
        arbitraryJournalArticle(),
      ],
    );

    it('returns false', () => {
      expect(result).toBe(false);
    });
  });
});
