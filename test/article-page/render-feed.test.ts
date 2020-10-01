import createRenderFeed from '../../src/article-page/render-feed';
import Doi from '../../src/types/doi';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-feed', () => {
  it('displays nothing if there are no reviews', async () => {
    const renderFeed = createRenderFeed(
      async () => [],
      shouldNotBeCalled,
    );

    const rendered = await renderFeed(new Doi('10.1101/12345678'));

    expect(rendered.unsafelyUnwrapErr()).toBe('no-content');
  });
});
