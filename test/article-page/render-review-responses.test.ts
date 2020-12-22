import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import createRenderReviewResponses from '../../src/article-page/render-review-responses';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('render-review-responses', () => {
  it('displays the response counts by type', async () => {
    const renderReviewResponses = createRenderReviewResponses(
      () => T.of({
        helpfulCount: 35,
        notHelpfulCount: 17,
      }),
      async () => Maybe.nothing(),
    );
    const rendered = await renderReviewResponses(new Doi('10.1101/111111'), O.none);

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when there is no current user response', () => {
    const renderReviewResponses = createRenderReviewResponses(
      () => T.of({
        helpfulCount: 35,
        notHelpfulCount: 17,
      }),
      async () => Maybe.nothing(),
    );

    it('displays an off `helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1101/111111'), O.some(toUserId('fakeuser')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });

    it('displays an off `not helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1101/111111'), O.some(toUserId('fakeuser')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `helpful`', () => {
    const renderReviewResponses = createRenderReviewResponses(() => T.of({
      helpfulCount: 1,
      notHelpfulCount: 0,
    }), async () => Maybe.just('helpful'));

    it('displays an on `helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-solid'));
    });

    it('displays an off `not helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-outline'));
    });
  });

  describe('when the user response is `not helpful`', () => {
    const renderReviewResponses = createRenderReviewResponses(() => T.of({
      helpfulCount: 0,
      notHelpfulCount: 1,
    }), async () => Maybe.just('not-helpful'));

    it('displays an on `not helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-down-solid'));
    });

    it('displays an off `helpful` button', async () => {
      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });
});
