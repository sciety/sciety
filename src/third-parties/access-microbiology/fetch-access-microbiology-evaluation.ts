import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { accessMicrobiologyXmlResponse000569 } from './acmi.0.000569.v1';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

const parser = new XMLParser({});
const builder = new XMLBuilder();

const xmlCodec = t.strict({
  article: t.strict({
    'sub-article': t.readonlyArray(
      t.strict({
        'front-stub': t.strict({
          'article-id': t.string,
        }),
        body: t.unknown,
      }),
    ),
  }),
});

const parseXmlAsAJavascriptObject = (accessMicrobiologyXmlResponse: string) => pipe(
  parser.parse(accessMicrobiologyXmlResponse),
  xmlCodec.decode,
  E.mapLeft(() => DE.unavailable),
);

const decodeResponse = (logger: Logger) => (response: unknown) => pipe(
  response,
  decodeAndLogFailures(logger, t.string),
  E.mapLeft(() => DE.unavailable),
  E.chain(parseXmlAsAJavascriptObject),
);

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => {
  logger('debug', 'calling fetchAccessMicrobiology', { key });
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return pipe(
      'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml',
      queryExternalService(),
      TE.chainEitherKW(decodeResponse(logger)),
      TE.map((response) => builder.build(response.article['sub-article'][2].body).toString() as string),
      TE.map((text) => ({
        url: new URL(`https://doi.org/${key}`),
        fullText: sanitise(toHtmlFragment(text)),
      })),
    );
  }
  if (key === '10.1099/acmi.0.000569.v1.4') {
    return pipe(
      parseXmlAsAJavascriptObject(accessMicrobiologyXmlResponse000569),
      TE.fromEither,
      TE.map((response) => builder.build(response.article['sub-article'][3].body).toString() as string),
      TE.map((text) => ({
        url: new URL(`https://doi.org/${key}`),
        fullText: sanitise(toHtmlFragment(text)),
      })),
    );
  }
  return TE.left(DE.unavailable);
};
