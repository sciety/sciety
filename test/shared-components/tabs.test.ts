import { JSDOM } from 'jsdom';
import { tabs } from '../../src/shared-components/tabs';
import { arbitraryHtmlFragment, arbitraryUri } from '../helpers';

describe('tabs', () => {
  it.todo('shows an active tab label');

  it.todo('active tab is not a link');

  it.todo('shows inactive tab as link');

  it.todo('orders tabs independently of active state');

  it('shows the content in the tab panel', () => {
    const content = arbitraryHtmlFragment();
    const rendered = JSDOM.fragment(tabs(content, arbitraryUri()));
    const tabPanelContent = rendered.querySelector('[role="tabpanel"]');

    expect(tabPanelContent?.innerHTML.trim()).toStrictEqual(content);
  });
});
