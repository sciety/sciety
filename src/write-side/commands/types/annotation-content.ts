import { sanitisedUserInputCodec } from '../../../types/sanitised-user-input';

export const annotationContentCodec = sanitisedUserInputCodec({ maxInputLength: 4000, allowEmptyInput: false });
