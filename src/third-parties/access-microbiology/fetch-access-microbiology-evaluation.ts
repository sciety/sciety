import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { XMLParser } from 'fast-xml-parser';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { accessMicrobiologyXmlResponse } from './acmi.0.000530.v1';

const parser = new XMLParser({});

const xmlCodec = t.strict({
  article: t.strict({
    'sub-article': t.readonlyArray(
      t.strict({
        'front-stub': t.strict({
          'article-id': t.string,
        }),
      }),
    ),
  }),
});

export const fetchAccessMicrobiologyEvaluation = (logger: Logger): EvaluationFetcher => (key: string) => {
  const parsedXmlResponse = parser.parse(accessMicrobiologyXmlResponse);
  const decodedXmlResponse = pipe(
    parsedXmlResponse,
    xmlCodec.decode,
  );

  logger('debug', 'calling fetchAccessMicrobiology', { key, parsedXmlResponse, decodedXmlResponse });
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return TE.right({
      url: new URL(`https://doi.org/${key}`),
      fullText: sanitise(toHtmlFragment(`
      <p>In this manuscript, the authors present a case report of pulmonary nocardiosis, describing the course of the disease and treatment and the microbiological traits of the pathogen Nocardia otitidiscaviarum. As such, the report is a valuable contribution to the medical literature. However, after different consultations with the Editorial Office, we agree that the section about the literature review should be improved before progressing the manuscript to peer-review. In particular, we believe that the paper would greatly benefit from a deeper discussion of the differences and commonalities between previous reports and the one your present here, either where you state that you have done a literature review (line 179) or in the discussion. This would be much more appreciated by the potential readers.</p>    
      `)),
    });
  }
  return TE.left(DE.unavailable);
};
