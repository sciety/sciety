import * as O from 'fp-ts/Option';
import { renderReviewResponses } from '../../src/article-page/render-review-responses';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('render-review-responses', () => {
  it('displays the response counts by type', async () => {
    const rendered = await renderReviewResponses({
      reviewId: arbitraryReviewId(),
      counts: {
        helpfulCount: 35,
        notHelpfulCount: 17,
      },
      current: O.none,
    });

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when there is no current user response', () => {
    const rendered = renderReviewResponses({
      reviewId: arbitraryReviewId(),
      counts: {
        helpfulCount: 35,
        notHelpfulCount: 17,
      },
      current: O.none,
    });

    it('displays an off `helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });

    it('displays an off `not helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `helpful`', () => {
    const rendered = renderReviewResponses({
      reviewId: arbitraryReviewId(),
      counts: {
        helpfulCount: 1,
        notHelpfulCount: 0,
      },
      current: O.some('helpful'),
    });

    it('displays an on `helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-up-solid'));
    });

    it('displays an off `not helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `not helpful`', () => {
    const rendered = renderReviewResponses({
      reviewId: arbitraryReviewId(),
      counts: {
        helpfulCount: 1,
        notHelpfulCount: 0,
      },
      current: O.some('not-helpful'),
    });

    it('displays an on `not helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-down-solid'));
    });

    it('displays an off `helpful` button', async () => {
      expect(await rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });
});
