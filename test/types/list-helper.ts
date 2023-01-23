import { arbitraryListId } from './list-id.helper';
import { arbitraryListOwnerId } from './list-owner-id.helper';
import { List } from '../../src/types/list';
import { arbitraryDate, arbitraryString } from '../helpers';

export const arbitraryList = (name?: string): List => ({
  id: arbitraryListId(),
  name: name ?? arbitraryString(),
  description: arbitraryString(),
  articleIds: [],
  lastUpdated: arbitraryDate(),
  ownerId: arbitraryListOwnerId(),
});
