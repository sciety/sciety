import * as TE from 'fp-ts/TaskEither';
import { hasStubbedSocialMentions } from './stubbed-social-mentions-doi';
import { ExternalQueries } from '../../third-parties';

export const fetchSembleCardUrls: ExternalQueries['fetchSembleCardUrls'] = (history) => TE.right(
  hasStubbedSocialMentions(history)
    ? ['https://semble.example.com/cards/stubbed-card']
    : [],
);
