import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { annotationContentCodec } from './annotation-content-codec';
import { externalInputFieldNames } from '../../standards';

export const createAnnotationCommandCodec = t.type({
  [externalInputFieldNames.contentInput]: annotationContentCodec,
  [externalInputFieldNames.articleIdInputName]: DoiFromString,
  [externalInputFieldNames.listIdInputName]: listIdCodec,
});

export type CreateAnnotationCommand = t.TypeOf<typeof createAnnotationCommandCodec>;
