import * as t from 'io-ts';
import { ArticleId } from '../types/article-id';
import { paperIdThatIsAUuidCodec } from './paper-id-that-is-a-uuid';
import { PaperIdThatIsADoi, paperIdThatIsADoiCodec } from './paper-id-that-is-a-doi';

export { isUuid } from './paper-id-that-is-a-uuid';
export { isDoi, PaperIdThatIsADoi } from './paper-id-that-is-a-doi';

export const getDoiPortion = (paperId: PaperIdThatIsADoi): string => paperId.split(':')[1];

export const toArticleId = (paperId: PaperIdThatIsADoi): ArticleId => new ArticleId(getDoiPortion(paperId));

export const fromArticleId = (articleId: ArticleId): PaperIdThatIsADoi => `doi:${articleId.value}` as PaperIdThatIsADoi;

export const paperIdCodec = t.union([paperIdThatIsADoiCodec, paperIdThatIsAUuidCodec]);

export type PaperId = t.TypeOf<typeof paperIdCodec>;
