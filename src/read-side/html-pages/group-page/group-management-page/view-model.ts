import { GroupId } from '../../../../types/group-id';
import { ListId } from '../../../../types/list-id';
import { ListCardViewModel } from '../../shared-components/list-card';

export type CurrentlyFeaturedLists = ReadonlyArray<{
  listName: string,
  listId: ListId,
  forGroup: GroupId,
  successRedirectPath: string,
}>;

export type ListThatCanBeFeatured = {
  listName: string,
  listId: ListId,
  forGroup: GroupId,
  successRedirectPath: string,
  listCard: ListCardViewModel,
};

export type ListsThatCanBeFeatured = ReadonlyArray<ListThatCanBeFeatured>;

export type ViewModel = {
  pageHeading: string,
  groupHomePageHref: string,
  groupEngagementDashboardHref: string,
  currentlyFeaturedLists: CurrentlyFeaturedLists,
  listsThatCanBeFeatured: ListsThatCanBeFeatured,
};
