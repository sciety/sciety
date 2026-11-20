import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { hasStubbedSocialMentions } from './stubbed-social-mentions-doi';
import { ExternalQueries } from '../../third-parties';
import { ActivityPubMention } from '../../types/activitypub-mention';

const stubbedNotes: ReadonlyArray<ActivityPubMention> = [
  {
    id: 'https://mastodon.example.com/users/alex/statuses/1',
    source: 'Mastodon',
    href: 'https://mastodon.example.com/@alex/1',
    attributedTo: 'https://mastodon.example.com/users/alex',
    author: O.some({
      displayName: 'Alex Scientist',
      handle: 'alex@mastodon.example.com',
      avatarUrl: O.some('/static/images/profile-dark.svg'),
    }),
    content: '<p>New preprint showing that functional peroxisomes are needed for heat-induced hormesis in <i>C. elegans</i>. Worth a read.</p>',
    published: new Date('2024-05-06T09:00:00Z'),
  },
  {
    id: 'https://bonfire.example.com/pub/objects/1',
    source: 'Bonfire',
    href: 'https://bonfire.example.com/post/1',
    attributedTo: 'https://bonfire.example.com/pub/actors/robin',
    author: O.none,
    content: '<p>Interesting discussion of the antioxidant response in the <i>Δctl-2</i> mutant.</p>',
    published: new Date('2024-05-04T09:00:00Z'),
  },
];

export const fetchActivityPubNotes: ExternalQueries['fetchActivityPubNotes'] = (history) => TE.right(
  hasStubbedSocialMentions(history) ? stubbedNotes : [],
);
