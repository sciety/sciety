import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { Logger } from './logger';
import { Review } from './review';
import { toHtmlFragment } from '../types/html-fragment';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';

export type GetJson = (uri: string) => Promise<Json>;

export type FetchHypothesisAnnotation = (id: HypothesisAnnotationId) => T.Task<Review>;

type HypothesisResponse = {
  created: string,
  text: string,
  links: {
    incontext: string,
  },
};

export const fetchHypothesisAnnotation = (getJson: GetJson, logger: Logger): FetchHypothesisAnnotation => {
  const converter = new Remarkable({ html: true }).use(linkify);
  return (id) => async () => {
    const uri = `https://api.hypothes.is/api/annotations/${id.value}`;

    logger('debug', 'Fetching review from Hypothesis', { uri });
    return getJson(uri)
      .then((response) => {
        const data = response as HypothesisResponse;
        const review: Review = {
          fullText: pipe(
            data.text,
            O.fromNullable,
            O.map((text) => converter.render(text)),
            O.map(toHtmlFragment),
          ),
          url: new URL(data.links.incontext),
        };
        logger('debug', 'Retrieved review', { ...review, fullText: '[text]' });
        return review;
      })
      .catch((error) => {
        logger('error', 'Failed to fetch hypothesis review', { uri, error });
        throw (error);
      });
  };
};
