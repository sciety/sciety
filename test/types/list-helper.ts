import { arbitraryListId } from './list-id.helper.js';
import { arbitraryListOwnerId } from './list-owner-id.helper.js';
import { List } from '../../src/types/list.js';
import { arbitraryDate, arbitraryString } from '../helpers.js';

export const arbitraryList = (ownerId = arbitraryListOwnerId()): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  articleIds: [],
  updatedAt: arbitraryDate(),
  ownerId,
});
