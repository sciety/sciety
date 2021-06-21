import { JSDOM } from 'jsdom';
import { Tab, tabs } from '../../src/shared-components/tabs';
import {
  arbitraryHtmlFragment, arbitraryNumber, arbitraryString, arbitraryUri,
} from '../helpers';

const arbitraryBoolean = () => !!arbitraryNumber(0, 1);

const eachTabActiveOnce: ReadonlyArray<[boolean, number, number]> = [[true, 0, 1], [false, 1, 0]];

const arbitraryTabList: [Tab, Tab] = [
  { label: arbitraryString(), uri: arbitraryUri() },
  { label: arbitraryString(), uri: arbitraryUri() },
];

describe('tabs', () => {
  it.each(eachTabActiveOnce)('shows an active tab label, isFirstTabActive: %s', (isFirstTabActive, activeTabIndex) => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        arbitraryTabList,
        isFirstTabActive,
      ),
    );
    const activeTab = rendered.querySelector('[role="tab"][aria-selected="true"]');

    expect(activeTab?.textContent).toStrictEqual(arbitraryTabList[activeTabIndex].label);
  });

  it('active tab is not a link', () => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        [{ label: arbitraryString(), uri: arbitraryUri() }, { label: arbitraryString(), uri: arbitraryUri() }],
        arbitraryBoolean(),
      ),
    );
    const activeTab = rendered.querySelector('[role="tab"][aria-selected="true"]');

    expect(activeTab?.tagName).not.toStrictEqual('A');
  });

  it.each(eachTabActiveOnce)('shows inactive tab as link, isFirstTabActive: %s', (isFirstTabActive, _, inactiveTabIndex) => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        arbitraryTabList,
        isFirstTabActive,
      ),
    );
    const inactiveTab = rendered.querySelector('[role="tab"]:not([aria-selected="true"])');

    expect(inactiveTab?.tagName).toStrictEqual('A');
    expect(inactiveTab?.getAttribute('href')).toStrictEqual(arbitraryTabList[inactiveTabIndex].uri);
  });

  it.each(eachTabActiveOnce)('shows the correct label for inactive tab, isFirstTabActive: %s', (isFirstTabActive, _, inactiveTabIndex) => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        arbitraryTabList,
        isFirstTabActive,
      ),
    );
    const inactiveTab = rendered.querySelector('[role="tab"]:not([aria-selected="true"])');

    expect(inactiveTab?.textContent).toStrictEqual(arbitraryTabList[inactiveTabIndex].label);
  });

  it('orders tabs independently of active state', () => {
    const rendered = JSDOM.fragment(
      tabs(
        arbitraryHtmlFragment(),
        arbitraryTabList,
        arbitraryBoolean(),
      ),
    );
    const tabElements = rendered.querySelectorAll('[role="tab"]');
    const tabLabels = Array.from(tabElements).map((tab) => tab.textContent);

    expect(tabLabels).toStrictEqual([arbitraryTabList[0].label, arbitraryTabList[1].label]);
  });

  it('shows the content in the tab panel', () => {
    const content = arbitraryHtmlFragment();
    const rendered = JSDOM.fragment(
      tabs(
        content,
        arbitraryTabList,
        arbitraryBoolean(),
      ),
    );
    const tabPanelContent = rendered.querySelector('[role="tabpanel"]');

    expect(tabPanelContent?.innerHTML.trim()).toStrictEqual(content);
  });
});
