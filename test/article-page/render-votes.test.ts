import createRenderVotes from '../../src/article-page/render-votes';
import Doi from '../../src/types/doi';

describe('render-votes', () => {
  it('displays the number of votes', async () => {
    const renderVotes = createRenderVotes(async () => ({
      upVotes: 35,
      downVotes: 17,
    }));
    const rendered = await renderVotes(new Doi('10.1101/111111'));

    expect(rendered).toStrictEqual(expect.stringContaining('35 people found this helpful'));
    expect(rendered).toStrictEqual(expect.stringContaining('17 people found this unhelpful'));
  });
});
