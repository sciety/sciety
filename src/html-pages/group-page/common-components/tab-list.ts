import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Tab } from '../../../shared-components/tabs';
import { toHtmlFragment } from '../../../types/html-fragment';
import { TabsViewModel } from './tabs-view-model';

export const tabList = (viewmodel: TabsViewModel): RNEA.ReadonlyNonEmptyArray<Tab> => [
  {
    label: toHtmlFragment('Group feed'),
    url: `/groups/${viewmodel.groupSlug}/feed`,
  },
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${viewmodel.listCount} </span>Lists<span aria-hidden="true"> (${viewmodel.listCount})</span>`),
    url: `/groups/${viewmodel.groupSlug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${viewmodel.groupSlug}/about`,
  },
];
