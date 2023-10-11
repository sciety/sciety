import * as t from 'io-ts';
import { userGeneratedInputCodec } from '../../types/user-generated-input';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const createAnnotationCommandCodec = t.type({
  content: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false }),
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type CreateAnnotationCommand = t.TypeOf<typeof createAnnotationCommandCodec>;
