import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { SharedPorts } from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';

export type CollectedPorts = SharedPorts & {
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
};
