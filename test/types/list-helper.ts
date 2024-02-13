import { arbitraryListId } from './list-id.helper';
import { arbitraryListOwnerId } from './list-owner-id.helper';
import { List } from '../../src/read-models/lists/list';
import { arbitraryDate, arbitraryString } from '../helpers';

export const arbitraryList = (ownerId = arbitraryListOwnerId()): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  entries: [],
  updatedAt: arbitraryDate(),
  ownerId,
});
