import { JSDOM } from 'jsdom';
import { Tab, tabs } from '../../src/shared-components/tabs';
import { toHtmlFragment } from '../../src/types/html-fragment';
import {
  arbitraryHtmlFragment, arbitraryNumber, arbitraryUri,
} from '../helpers';

type EachTabActiveOnce = ReadonlyArray<[{
  activeTabIndex: 0 | 1 | 2,
  inactiveTabsIndices: ReadonlyArray<0 | 1 | 2>,
}]>;

const eachTabActiveOnce: EachTabActiveOnce = [
  [{ activeTabIndex: 0, inactiveTabsIndices: [1, 2] }],
  [{ activeTabIndex: 1, inactiveTabsIndices: [0, 2] }],
  [{ activeTabIndex: 2, inactiveTabsIndices: [0, 1] }],
];

const arbitraryTabList: [Tab, Tab, Tab] = [
  { label: toHtmlFragment('first'), url: arbitraryUri() },
  { label: toHtmlFragment('second'), url: arbitraryUri() },
  { label: toHtmlFragment('third'), url: arbitraryUri() },
];

describe('tabs', () => {
  it.each(eachTabActiveOnce)('shows an active tab label: %s', ({ activeTabIndex }) => {
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex,
      })(
        arbitraryHtmlFragment(),
      ),
    );
    const activeTab = rendered.querySelector('[role="tab"][aria-selected="true"]');

    expect(activeTab?.textContent).toStrictEqual(arbitraryTabList[activeTabIndex].label);
  });

  it('active tab is not a link', () => {
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex: arbitraryNumber(0, 2),
      })(
        arbitraryHtmlFragment(),
      ),
    );
    const activeTab = rendered.querySelector('[role="tab"][aria-selected="true"]');

    expect(activeTab?.tagName).not.toBe('A');
  });

  it.each(eachTabActiveOnce)('shows inactive tabs as links: %s', ({ activeTabIndex, inactiveTabsIndices }) => {
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex,
      })(
        arbitraryHtmlFragment(),
      ),
    );
    const inactiveTabs = Array.from(rendered.querySelectorAll('[role="tab"]:not([aria-selected="true"])'));

    expect(inactiveTabs[0].tagName).toBe('A');
    expect(inactiveTabs[0].getAttribute('href')).toStrictEqual(arbitraryTabList[inactiveTabsIndices[0]].url);

    expect(inactiveTabs[1].tagName).toBe('A');
    expect(inactiveTabs[1].getAttribute('href')).toStrictEqual(arbitraryTabList[inactiveTabsIndices[1]].url);
  });

  it.each(eachTabActiveOnce)('shows the correct labels for inactive tabs: %s', ({ activeTabIndex, inactiveTabsIndices }) => {
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex,
      })(
        arbitraryHtmlFragment(),
      ),
    );
    const inactiveTabs = Array.from(rendered.querySelectorAll('[role="tab"]:not([aria-selected="true"])'));

    expect(inactiveTabs[0].textContent).toStrictEqual(arbitraryTabList[inactiveTabsIndices[0]].label);
    expect(inactiveTabs[1].textContent).toStrictEqual(arbitraryTabList[inactiveTabsIndices[1]].label);
  });

  it('orders tabs independently of active state', () => {
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex: arbitraryNumber(0, 2),
      })(
        arbitraryHtmlFragment(),
      ),
    );
    const tabElements = rendered.querySelectorAll('[role="tab"]');
    const tabLabels = Array.from(tabElements).map((tab) => tab.textContent);

    expect(tabLabels).toStrictEqual([arbitraryTabList[0].label, arbitraryTabList[1].label, arbitraryTabList[2].label]);
  });

  it('shows the content in the tab panel', () => {
    const content = arbitraryHtmlFragment();
    const rendered = JSDOM.fragment(
      tabs({
        tabList: arbitraryTabList,
        activeTabIndex: arbitraryNumber(0, 2),
      })(
        content,
      ),
    );
    const tabPanelContent = rendered.querySelector('[role="tabpanel"]');

    expect(tabPanelContent?.innerHTML.trim()).toStrictEqual(content);
  });
});
