import { Maybe } from 'true-myth';
import createRenderReviewResponses from '../../src/article-page/render-review-responses';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('render-review-responses', () => {
  it('displays the response counts by type', async () => {
    const renderReviewResponses = createRenderReviewResponses(
      async () => ({
        helpfulCount: 35,
        notHelpfulCount: 17,
      }),
      async () => Maybe.nothing(),
    );
    const rendered = await renderReviewResponses(new Doi('10.1101/111111'), Maybe.nothing());

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when there is no current user response', () => {
    it('displays a not active `helpful` button', async () => {
      const renderReviewResponses = createRenderReviewResponses(
        async () => ({
          helpfulCount: 35,
          notHelpfulCount: 17,
        }),
        async () => Maybe.nothing(),
      );
      const rendered = await renderReviewResponses(new Doi('10.1101/111111'), Maybe.just(toUserId('fakeuser')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });

  describe('when the user response is `helpful`', () => {
    it('displays an active `helpful` button', async () => {
      const renderReviewResponses = createRenderReviewResponses(async () => ({
        helpfulCount: 1,
        notHelpfulCount: 0,
      }), async () => Maybe.just('helpful'));

      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-solid'));
    });
  });
});
