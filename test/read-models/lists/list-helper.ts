import { List } from '../../../src/read-models/lists/list';
import { rawUserInput } from '../../../src/read-side';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

export const arbitraryList = (ownerId = arbitraryListOwnerId()): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: rawUserInput(arbitraryString()),
  entries: [],
  updatedAt: arbitraryDate(),
  ownerId,
});
