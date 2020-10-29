import createRenderVotes from '../../src/article-page/render-votes';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('render-votes', () => {
  it.todo('uses the word `helpful`?');

  it('displays the number of votes', async () => {
    const renderVotes = createRenderVotes(
      async () => ({
        upVotes: 35,
        downVotes: 17,
      }),
      async () => 'not',
    );
    const rendered = await renderVotes(new Doi('10.1101/111111'), toUserId('fakeuser'));

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
        async () => 'not',
      );
      const rendered = await renderVotes(new Doi('10.1101/111111'), toUserId('fakeuser'));

      // TODO: what to assert on?
      expect(rendered).toStrictEqual(expect.stringContaining('thumb-up-outline'));
    });
  });

  it.todo('ask for the right users votes');
});
