import { GroupId } from '../../../../types/group-id';
import { ListId } from '../../../../types/list-id';

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
};

export type ListsThatCanBeFeatured = ReadonlyArray<ListThatCanBeFeatured>;

export type ViewModel = {
  pageHeading: string,
  groupHomePageHref: string,
  currentlyFeaturedLists: CurrentlyFeaturedLists,
  listsThatCanBeFeatured: ListsThatCanBeFeatured,
};
