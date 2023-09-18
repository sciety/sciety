import { CreateListCommand } from '../../../src/write-side/commands';
import { arbitraryString } from '../../helpers';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

// ts-unused-exports:disable-next-line
export const arbitraryCreateListCommand = (): CreateListCommand => ({
  listId: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  ownerId: arbitraryListOwnerId(),
});
