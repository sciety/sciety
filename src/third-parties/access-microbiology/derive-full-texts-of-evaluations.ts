import * as E from 'fp-ts/Either';
import * as S from 'fp-ts/string';
import * as RM from 'fp-ts/ReadonlyMap';
import * as t from 'io-ts';
import { identity, pipe } from 'fp-ts/function';
import { XMLParser } from 'fast-xml-parser';
import * as RA from 'fp-ts/ReadonlyArray';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { AcmiJats, acmiJatsCodec } from './acmi-jats';
import * as AED from './acmi-evaluation-doi';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';
import { decodeAndLogFailures } from '../decode-and-log-failures';

const parser = new XMLParser({
  isArray: (tagName) => tagName === 'sub-article',
  stopNodes: ['article.sub-article.body'],
});

const parseXmlDocument = (s: string) => E.tryCatch(
  () => parser.parse(s) as unknown,
  identity,
);

const hasBody = (subArticle: AcmiJats['article']['sub-article'][number]) => subArticle.body !== undefined;

const toMapEntry = (subArticleWithABody: AcmiJats['article']['sub-article'][number]): [AED.AcmiEvaluationDoi, SanitisedHtmlFragment] => [
  AED.fromValidatedString(subArticleWithABody['front-stub']['article-id']),
  sanitise(toHtmlFragment((subArticleWithABody.body ?? '').trim())),
];

export const lookupFullText = (
  key: string,
) => (
  map: FullTextsOfEvaluations,
): E.Either<DE.DataError, SanitisedHtmlFragment> => pipe(
  map,
  RM.lookup(S.Eq)(key),
  E.fromOption(() => DE.notFound),
);

type FullTextsOfEvaluations = ReadonlyMap<AED.AcmiEvaluationDoi, SanitisedHtmlFragment>;

const accessMicrobiologyXmlResponseCodec = t.string;

export const deriveFullTextsOfEvaluations = (
  logger: Logger,
) => (
  input: unknown,
): E.Either<DE.DataError, FullTextsOfEvaluations> => pipe(
  input,
  decodeAndLogFailures(logger, accessMicrobiologyXmlResponseCodec, { codec: 'accessMicrobiologyXmlResponseCodec' }),
  E.chainW(parseXmlDocument),
  E.chainW(decodeAndLogFailures(logger, acmiJatsCodec)),
  E.map((acmiJats) => acmiJats.article['sub-article']),
  E.map(RA.filter(hasBody)),
  E.map(RA.map(toMapEntry)),
  E.map((mapEntries) => new Map(mapEntries)),
  E.mapLeft(() => DE.unavailable),
);
