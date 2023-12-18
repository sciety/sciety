import * as t from 'io-ts';
import { paperIdThatIsADoiCodec } from './paper-id-that-is-a-doi';

export { isUuid } from './paper-id-that-is-a-uuid';
export {
  isDoi, PaperIdThatIsADoi, getDoiPortion, toArticleId, fromArticleId,
} from './paper-id-that-is-a-doi';

export const paperIdCodec = paperIdThatIsADoiCodec;

export type PaperId = t.TypeOf<typeof paperIdCodec>;
