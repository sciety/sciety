import { ListId } from '../types/list-id';

type ListPageLinkHrefViewModel = {
  listId: ListId,
  userHandle?: string,
};

export const renderListPageLinkHref = (
  viewModel: ListPageLinkHrefViewModel,
): string => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return `/lists/${viewModel.listId}`;
  }
  return viewModel.userHandle ? `/users/${viewModel.userHandle}/lists/saved-articles` : `/lists/${viewModel.listId}`;
};
