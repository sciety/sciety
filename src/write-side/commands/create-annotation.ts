import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { annotationContentCodec } from './annotation-content-codec';
import { articleIdInputName } from '../../standards';

export const createAnnotationCommandCodec = t.type({
  content: annotationContentCodec,
  [articleIdInputName]: DoiFromString,
  listId: listIdCodec,
});

export type CreateAnnotationCommand = t.TypeOf<typeof createAnnotationCommandCodec>;
