import { ListId } from '../types/list-id';

type ListPageLinkHrefViewModel = {
  listId: ListId,
  userHandle?: string,
};

export const renderListPageLinkHref = (
  viewModel: ListPageLinkHrefViewModel,
): string => (viewModel.userHandle ? `/users/${viewModel.userHandle}/lists/saved-articles` : `/lists/${viewModel.listId}`);
