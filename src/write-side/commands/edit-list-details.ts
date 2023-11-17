import * as t from 'io-ts';
import { listIdCodec } from '../../types/list-id.js';
import { sanitisedUserInputCodec } from '../../types/sanitised-user-input.js';
import { inputFieldNames } from '../../standards/input-field-names.js';

export const listNameMaxLength = 100;
export const listDescriptionMaxLength = 250;

export const editListDetailsCommandCodec = t.strict({
  [inputFieldNames.listName]: sanitisedUserInputCodec({ maxInputLength: listNameMaxLength }),
  description: sanitisedUserInputCodec({ maxInputLength: listDescriptionMaxLength, allowEmptyInput: true }),
  listId: listIdCodec,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
