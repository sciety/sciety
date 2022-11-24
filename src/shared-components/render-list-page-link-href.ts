import { ListId } from '../types/list-id';

type ListPageLinkHrefViewModel = {
  listId: ListId,
  userHandle?: string,
};

export const renderListPageLinkHref = (
  viewModel: ListPageLinkHrefViewModel,
): string => {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    return `/lists/${viewModel.listId}`;
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return viewModel.userHandle ? `/users/${viewModel.userHandle}/lists/saved-articles` : `/lists/${viewModel.listId}`;
};
