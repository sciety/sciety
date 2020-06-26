import HypothesisAnnotationId from '../data/hypothesis-annotation-id';
import createLogger from '../logger';
import { Json, JsonCompatible } from '../types/json';
import { Review } from '../types/review';

export type GetJson = (uri: string) => Promise<Json>;

export type FetchHypothesisAnnotation = (id: HypothesisAnnotationId) => Promise<Review>;

type HypothesisResponse = JsonCompatible<{
  created: string;
  text: string;
  links: {
    incontext: string;
  };
}>;

export default (getJson: GetJson): FetchHypothesisAnnotation => {
  const log = createLogger('api:fetch-hypothesis-annotation');
  return async (id) => {
    const uri = `https://api.hypothes.is/api/annotations/${id.value}`;
    const data = await getJson(uri) as HypothesisResponse;
    log(data);
    return {
      publicationDate: new Date(data.created),
      summary: data.text,
      url: new URL(data.links.incontext),
    };
  };
};
