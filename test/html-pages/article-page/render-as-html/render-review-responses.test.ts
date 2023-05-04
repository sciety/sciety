import * as O from 'fp-ts/Option';
import { renderReviewResponses } from '../../../../src/html-pages/article-page/render-as-html/render-review-responses';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';

describe('render-review-responses', () => {
  it('displays the response counts by type', () => {
    const rendered = renderReviewResponses(
      arbitraryEvaluationLocator(),
      {
        helpfulCount: 35,
        notHelpfulCount: 17,
      },
      O.none,
    );

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when there is no current user response', () => {
    const rendered = renderReviewResponses(
      arbitraryEvaluationLocator(),
      {
        helpfulCount: 35,
        notHelpfulCount: 17,
      },
      O.none,
    );

    it('displays an off `helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });

    it('displays an off `not helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `helpful`', () => {
    const rendered = renderReviewResponses(
      arbitraryEvaluationLocator(),
      {
        helpfulCount: 1,
        notHelpfulCount: 0,
      },
      O.some('helpful'),
    );

    it('displays an on `helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-solid'));
    });

    it('displays an off `not helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `not helpful`', () => {
    const rendered = renderReviewResponses(
      arbitraryEvaluationLocator(),
      {
        helpfulCount: 1,
        notHelpfulCount: 0,
      },
      O.some('not-helpful'),
    );

    it('displays an on `not helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-solid'));
    });

    it('displays an off `helpful` button', () => {
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });
});
