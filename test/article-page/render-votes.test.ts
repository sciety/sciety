import createRenderVotes from '../../src/article-page/render-votes';
import Doi from '../../src/types/doi';

describe('render-votes', () => {
  it.todo('uses the word `helpful`?');

  it('displays the number of votes', async () => {
    const renderVotes = createRenderVotes(
      async () => ({
        upVotes: 35,
        downVotes: 17,
      }),
      async () => ({
        upVoted: false,
        downVoted: false,
      }),
    );
    const rendered = await renderVotes(new Doi('10.1101/111111'));

    expect(rendered).toStrictEqual(expect.stringContaining('35'));
    expect(rendered).toStrictEqual(expect.stringContaining('17'));
  });

  describe('when the user has not upvoted', () => {
    it('displays a not active upvote button', async () => {
      const renderVotes = createRenderVotes(
        async () => ({
          upVotes: 35,
          downVotes: 17,
        }),
        async () => ({
          upVoted: false,
          downVoted: false,
        }),
      );
      const rendered = await renderVotes(new Doi('10.1101/111111'));

      // TODO: what to assert on?
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });
});
