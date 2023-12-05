import * as t from 'io-ts';
import { paperIdThatIsAUuidCodec } from './paper-id-that-is-a-uuid';
import { paperIdThatIsADoiCodec } from './paper-id-that-is-a-doi';

export { isUuid } from './paper-id-that-is-a-uuid';
export {
  isDoi, PaperIdThatIsADoi, getDoiPortion, toArticleId, fromArticleId,
} from './paper-id-that-is-a-doi';

export const paperIdCodec = t.union([paperIdThatIsADoiCodec, paperIdThatIsAUuidCodec]);

export type PaperId = t.TypeOf<typeof paperIdCodec>;
