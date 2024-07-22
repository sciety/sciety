import { EditListDetailsCommand } from '../../../src/write-side/commands';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitrarySanitisedUserInput } from '../../types/sanitised-user-input.helper';

export const arbitraryEditListDetailsCommand = (): EditListDetailsCommand => ({
  listId: arbitraryListId(),
  name: arbitrarySanitisedUserInput(),
  description: arbitrarySanitisedUserInput(),
});
