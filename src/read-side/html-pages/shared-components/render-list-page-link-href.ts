import { ListId } from '../../../types/list-id';

export const renderListPageLinkHref = (listId: ListId): string => (`/lists/${listId}`);
