import * as t from 'io-ts';
import { AnnotationTarget } from '../../types/annotation-target';
import { HtmlFragment } from '../../types/html-fragment';
import { userGeneratedInputCodec } from '../../types/user-generated-input';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const createAnnotationCommandCodec = t.type({
  annotationContent: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false }),
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: AnnotationTarget,
};
