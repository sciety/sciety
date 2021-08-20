import { renderDescription } from '../../../src/group-page/about/render-description';

describe('render-description', () => {
  it('renders the group description', async () => {
    const rendered = renderDescription('Something interesting');

    expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
  });
});
