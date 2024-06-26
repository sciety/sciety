import * as t from 'io-ts';
import { inputFieldNames } from '../../standards';
import { listIdCodec } from '../../types/list-id';
import { sanitisedUserInputCodec } from '../../types/sanitised-user-input';

export const listNameMaxLength = 100;
export const listDescriptionMaxLength = 250;

export const editListDetailsCommandCodec = t.strict({
  [inputFieldNames.listName]: sanitisedUserInputCodec({ maxInputLength: listNameMaxLength }),
  description: sanitisedUserInputCodec({ maxInputLength: listDescriptionMaxLength, allowEmptyInput: true }),
  listId: listIdCodec,
});

export type EditListDetailsCommand = t.TypeOf<typeof editListDetailsCommandCodec>;
