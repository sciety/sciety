import { NonEmptyString } from 'io-ts-types';
import * as uuid from 'uuid';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { ArticleId } from '../types/article-id';

export const isUuid = (input: unknown): input is PaperIdThatIsAUuid => typeof input === 'string' && input.startsWith('uuid:');

export const paperIdThatIsAUuidCodec = new t.Type<PaperIdThatIsAUuid, string, unknown>(
  'paperIdThatIsAUuid',
  isUuid,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate(uuid.validate),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(`uuid:${id}` as PaperIdThatIsAUuid),
      ),
    )),
  ),
  (a) => a.toString(),
);

type PaperIdThatIsAUuid = string & { readonly PaperIdThatIsAUuid: unique symbol };

export const isDoi = (input: unknown): input is PaperIdThatIsADoi => typeof input === 'string' && input.startsWith('doi:');

export const paperIdThatIsADoiCodec = new t.Type<PaperIdThatIsADoi, string, unknown>(
  'paperIdThatIsADoi',
  isDoi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate(() => true),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(`doi:${id}` as PaperIdThatIsADoi),
      ),
    )),
  ),
  (a) => a.toString(),
);

export type PaperIdThatIsADoi = string & { readonly PaperIdThatIsADoi: unique symbol };

export const getDoiPortion = (paperId: PaperIdThatIsADoi): string => paperId.split(':')[1];

export const toArticleId = (paperId: PaperIdThatIsADoi): ArticleId => new ArticleId(getDoiPortion(paperId));

export const fromArticleId = (articleId: ArticleId): PaperIdThatIsADoi => `doi:${articleId.value}` as PaperIdThatIsADoi;

export const paperIdCodec = t.union([paperIdThatIsADoiCodec, paperIdThatIsAUuidCodec]);

export type PaperId = t.TypeOf<typeof paperIdCodec>;

export const fromNonEmptyString = (candidate: NonEmptyString): PaperId => {
  if (uuid.validate(candidate)) {
    return pipe(
      candidate,
      paperIdThatIsAUuidCodec.decode,
      E.match(
        () => { throw new Error('Cannot happen'); },
        identity,
      ),
    );
  }
  return pipe(
    candidate,
    paperIdThatIsADoiCodec.decode,
    E.match(
      () => { throw new Error('Cannot happen'); },
      identity,
    ),
  );
};
