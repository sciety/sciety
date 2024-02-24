import { arbitraryListId } from '../../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper.js';
import { List } from '../../../src/read-models/lists/list.js';
import { arbitraryDate, arbitraryString } from '../../helpers.js';

export const arbitraryList = (ownerId = arbitraryListOwnerId()): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  entries: [],
  updatedAt: arbitraryDate(),
  ownerId,
});
