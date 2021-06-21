import { JSDOM } from 'jsdom';
import { tabs } from '../../src/shared-components/tabs';
import { arbitraryHtmlFragment, arbitraryUri } from '../helpers';

describe('tabs', () => {
  it('shows an active tab label', () => {
    const rendered = JSDOM.fragment(tabs(arbitraryHtmlFragment(), arbitraryUri()));
    const activeTab = rendered.querySelector('[role=tab][aria-selected=true]');

    expect(activeTab?.textContent).toStrictEqual('Saved articles');
  });

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
