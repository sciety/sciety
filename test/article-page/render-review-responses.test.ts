import { Maybe } from 'true-myth';
import createRenderReviewResponses from '../../src/article-page/render-review-responses';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('render-review-responses', () => {
  it.todo('uses the word `helpful`?');

  it('displays the number of votes', async () => {
    const renderReviewResponses = createRenderReviewResponses(
      async () => ({
        upVotes: 35,
        downVotes: 17,
      }),
      async () => 'not',
    );
    const rendered = await renderReviewResponses(new Doi('10.1101/111111'), Maybe.nothing());

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when the user has not upvoted', () => {
    it('displays a not active upvote button', async () => {
      const renderReviewResponses = createRenderReviewResponses(
        async () => ({
          upVotes: 35,
          downVotes: 17,
        }),
        async () => 'not',
      );
      const rendered = await renderReviewResponses(new Doi('10.1101/111111'), Maybe.just(toUserId('fakeuser')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });

  describe('when the user has upvoted', () => {
    it('displays an active upvote button', async () => {
      const renderReviewResponses = createRenderReviewResponses(async () => ({
        upVotes: 1,
        downVotes: 0,
      }), async () => 'up');

      const rendered = await renderReviewResponses(new Doi('10.1111/123456'), Maybe.just(toUserId('user')));

      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-solid'));
    });
  });
});
