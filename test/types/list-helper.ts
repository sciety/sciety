import { arbitraryListId } from './list-id.helper';
import { arbitraryListOwnerId } from './list-owner-id.helper';
import { List } from '../../src/types/list';
import { arbitraryDate, arbitraryString } from '../helpers';

export const arbitraryList = (): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  articleIds: [],
  lastUpdated: arbitraryDate(),
  ownerId: arbitraryListOwnerId(),
});
