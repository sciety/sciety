import { renderDescription } from '../../../../../src/html-pages/group-page/render-as-html/render-description';

describe('render-description', () => {
  it('renders the group description', async () => {
    const rendered = renderDescription('Something interesting');

    expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
  });
});
