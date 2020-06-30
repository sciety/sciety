import showdown from 'showdown';
import { Review } from './review';
import createLogger from '../logger';
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

export default (getJson: GetJson): FetchHypothesisAnnotation => {
  const converter = new showdown.Converter({ noHeaderId: true });
  converter.setFlavor('github');
  const log = createLogger('api:fetch-hypothesis-annotation');
  return async (id) => {
    const uri = `https://api.hypothes.is/api/annotations/${id.value}`;

    log(`Fetching review ${id.value} from Hypothesis`);
    const data = await getJson(uri) as HypothesisResponse;

    const response: Review = {
      publicationDate: new Date(data.created),
      summary: converter.makeHtml(data.text),
      url: new URL(data.links.incontext),
    };

    log(`Retrieved review: ${JSON.stringify({ ...response, summary: '[text]' })}`);

    return response;
  };
};
