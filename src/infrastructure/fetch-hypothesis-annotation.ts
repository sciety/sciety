import { URL } from 'url';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { Maybe } from 'true-myth';
import { Logger } from './logger';
import { Review } from './review';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { Json, JsonCompatible } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

export type FetchHypothesisAnnotation = (id: HypothesisAnnotationId) => Promise<Review>;

type HypothesisResponse = JsonCompatible<{
  created: string;
  text: string;
  links: {
    incontext: string;
  };
}>;

export default (getJson: GetJson, logger: Logger): FetchHypothesisAnnotation => {
  const converter = new Remarkable({ html: true }).use(linkify);
  return async (id) => {
    const uri = `https://api.hypothes.is/api/annotations/${id.value}`;

    logger('debug', 'Fetching review from Hypothesis', { uri });
    const data = await getJson(uri) as HypothesisResponse;

    const response: Review = {
      publicationDate: Maybe.just(new Date(data.created)),
      fullText: Maybe.just(data.text).map((text) => converter.render(text)),
      url: new URL(data.links.incontext),
    };

    logger('debug', 'Retrieved review', { ...response, fullText: '[text]' });

    return response;
  };
};
