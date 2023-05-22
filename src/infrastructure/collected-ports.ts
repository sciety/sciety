import { SharedPorts } from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { Queries } from '../shared-read-models';
import { RecordArticleDetails } from '../write-side/command-handlers/record-article-details-command-handler';

export type CollectedPorts = SharedPorts & Queries & {
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  recordArticleDetails: RecordArticleDetails,
};
