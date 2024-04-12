import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Tab } from '../../../shared-components/tabs';
import { toHtmlFragment } from '../../../types/html-fragment';
import { TabsViewModel } from './tabs-view-model';

// ts-unused-exports:disable-next-line
export const tabList = (viewmodel: TabsViewModel): RNEA.ReadonlyNonEmptyArray<Tab> => [
  {
    label: toHtmlFragment('Group feed'),
    url: `/groups/${viewmodel.groupSlug}/feed`,
  },
];
