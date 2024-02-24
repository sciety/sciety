import * as E from 'fp-ts/Either';
import * as S from 'fp-ts/string';
import * as RM from 'fp-ts/ReadonlyMap';
import * as t from 'io-ts';
import { identity, pipe } from 'fp-ts/function';
import { XMLParser } from 'fast-xml-parser';
import * as RA from 'fp-ts/ReadonlyArray';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { acmiJatsCodec, isSubArticleWithBody, SubArticleWithBody } from './acmi-jats.js';
import * as AED from './acmi-evaluation-doi.js';
import * as DE from '../../types/data-error.js';
import { Logger } from '../../infrastructure/index.js';
import { decodeAndLogFailures } from '../decode-and-log-failures.js';

const parser = new XMLParser({
  isArray: (tagName) => tagName === 'sub-article',
  stopNodes: ['article.sub-article.body'],
});

const parseXmlDocument = (s: string) => E.tryCatch(
  () => parser.parse(s) as unknown,
  identity,
);

const translateBoldToB = (input: string) => pipe(
  input,
  (s) => s.replaceAll('<bold>', '<b>'),
  (s) => s.replaceAll('</bold>', '</b>'),
);

const translateBodyToHtml = (body: string) => pipe(
  body,
  (s) => s.trim(),
  translateBoldToB,
  toHtmlFragment,
  sanitise,
);

const toMapEntry = (subArticleWithABody: SubArticleWithBody): [AED.AcmiEvaluationDoi, SanitisedHtmlFragment] => [
  AED.fromValidatedString(subArticleWithABody['front-stub']['article-id']),
  translateBodyToHtml(subArticleWithABody.body),
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
  E.map(RA.filter(isSubArticleWithBody)),
  E.map(RA.map(toMapEntry)),
  E.map((mapEntries) => new Map(mapEntries)),
  E.mapLeft(() => DE.unavailable),
);
