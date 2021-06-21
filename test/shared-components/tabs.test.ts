import { JSDOM } from 'jsdom';
import { Tab, tabs } from '../../src/shared-components/tabs';
import {
  arbitraryHtmlFragment, arbitraryString, arbitraryUri,
} from '../helpers';

describe('tabs', () => {
  it.each([
    [true],
    [false],
  ])('shows an active tab label, isFirstTabActive: %s', (isFirstTabActive) => {
    const tabList: [Tab, Tab] = [
      { label: arbitraryString(), uri: arbitraryUri() },
      { label: arbitraryString(), uri: arbitraryUri() },
    ];
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        tabList,
        isFirstTabActive,
      ),
    );
    const activeTab = rendered.querySelector('[role=tab][aria-selected=true]');

    expect(activeTab?.textContent).toStrictEqual(tabList[isFirstTabActive ? 0 : 1].label);
  });

  it('active tab is not a link', () => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        [{ label: arbitraryString(), uri: arbitraryUri() }, { label: arbitraryString(), uri: arbitraryUri() }],
        true,
      ),
    );
    const activeTab = rendered.querySelector('[role=tab][aria-selected=true]');

    expect(activeTab?.tagName).not.toStrictEqual('A');
  });

  it('shows inactive tab as link', () => {
    const inactiveTabTarget = arbitraryUri();
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        [{ label: arbitraryString(), uri: arbitraryUri() }, { label: arbitraryString(), uri: inactiveTabTarget }],
        true,
      ),
    );
    const inactiveTab = rendered.querySelector('[role="tab"]:not([aria-selected=true])');

    expect(inactiveTab?.tagName).toStrictEqual('A');
    expect(inactiveTab?.getAttribute('href')).toStrictEqual(inactiveTabTarget);
  });

  it('shows the correct label for inactive tab', () => {
    const inactiveTabLabel = arbitraryString();
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        [{ label: arbitraryString(), uri: arbitraryUri() }, { label: inactiveTabLabel, uri: arbitraryUri() }],
        true,
      ),
    );
    const inactiveTab = rendered.querySelector('[role="tab"]:not([aria-selected=true])');

    expect(inactiveTab?.textContent).toStrictEqual(inactiveTabLabel);
  });

  it('orders tabs independently of active state', () => {
    const tabLabelOne = arbitraryString();
    const tabLabelTwo = arbitraryString();
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        [{ label: tabLabelOne, uri: arbitraryUri() }, { label: tabLabelTwo, uri: arbitraryUri() }],
        true,
      ),
    );
    const tabElements = rendered.querySelectorAll('[role="tab"]');
    const tabLabels = Array.from(tabElements).map((tab) => tab.textContent);

    expect(tabLabels).toStrictEqual([tabLabelOne, tabLabelTwo]);
  });

  it('shows the content in the tab panel', () => {
    const content = arbitraryHtmlFragment();
    const rendered = JSDOM.fragment(
      tabs(
        content,
        [{ label: arbitraryString(), uri: arbitraryUri() }, { label: arbitraryString(), uri: arbitraryUri() }],
        true,
      ),
    );
    const tabPanelContent = rendered.querySelector('[role="tabpanel"]');

    expect(tabPanelContent?.innerHTML.trim()).toStrictEqual(content);
  });
});
