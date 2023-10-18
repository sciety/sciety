import { userGeneratedInputCodec } from '../../../types/user-generated-input';

export const annotationContentCodec = userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false });
