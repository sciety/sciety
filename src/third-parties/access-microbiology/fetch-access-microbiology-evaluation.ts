import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { accessMicrobiologyXmlResponse } from './acmi.0.000530.v1';

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

export const fetchAccessMicrobiologyEvaluation = (logger: Logger): EvaluationFetcher => (key: string) => {
  const parsedXmlResponse = parser.parse(accessMicrobiologyXmlResponse);

  logger('debug', 'calling fetchAccessMicrobiology', { key });
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return pipe(
      parsedXmlResponse,
      xmlCodec.decode,
      E.map((response) => builder.build(response.article['sub-article'][2].body).toString() as string),
      E.map((text) => ({
        url: new URL(`https://doi.org/${key}`),
        fullText: sanitise(toHtmlFragment(text)),
      })),
      E.mapLeft(() => DE.unavailable),
      TE.fromEither,
    );
  }
  return TE.left(DE.unavailable);
};
