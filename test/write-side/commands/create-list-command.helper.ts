import { CreateListCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryString } from '../../helpers.js';
import { arbitraryListId } from '../../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper.js';

export const arbitraryCreateListCommand = (): CreateListCommand => ({
  listId: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  ownerId: arbitraryListOwnerId(),
});
