import { Tab } from '../shared-components/tabs';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';

export const tabList = (doi: Doi): [Tab, Tab] => [
  {
    label: toHtmlFragment('<span class="visually-hidden">Discover information and abstract about this </span>Article'),
    url: `/articles/meta/${doi.value}`,
  },
  {
    label: toHtmlFragment('<span class="visually-hidden">Discover the </span>Activity<span class="visually-hidden"> around this article</span>'),
    url: `/articles/activity/${doi.value}`,
  },
];
