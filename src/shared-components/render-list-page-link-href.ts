import { ListId } from '../types/list-id.js';

export const renderListPageLinkHref = (listId: ListId): string => (`/lists/${listId}`);
