import { tabs } from '../../src/shared-components/tabs';
import { arbitraryHtmlFragment, arbitraryUri } from '../helpers';

describe('tabs', () => {
  it.todo('shows an active tab label');

  it.todo('active tab is not a link');

  it.todo('shows inactive tab as link');

  it.todo('orders tabs independently of active state');

  it('shows the panel content', () => {
    const content = arbitraryHtmlFragment();
    const rendered = tabs(content, arbitraryUri());

    expect(rendered).toContain(content);
  });
});
