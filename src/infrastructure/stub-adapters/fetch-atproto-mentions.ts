import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { hasStubbedSocialMentions } from './stubbed-social-mentions-doi';
import { ExternalQueries } from '../../third-parties';
import { AtprotoMention } from '../../types/atproto-mention';

const stubbedMentions: ReadonlyArray<AtprotoMention> = [
  {
    atUri: 'at://did:plc:stubbedblueskyauthor/app.bsky.feed.post/stubbedpost',
    source: 'Bluesky',
    authorHandle: 'jane-researcher.bsky.example.com',
    authorName: O.some('Jane Researcher'),
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    text: 'Really enjoyed this preprint on heat shock and peroxisomes. The lifespan data in the second figure are striking.',
    href: 'https://bsky.example.com/profile/jane-researcher.bsky.example.com/post/stubbedpost',
    createdAt: new Date('2024-05-10T09:00:00Z'),
  },
  {
    atUri: 'at://did:plc:stubbedsembleauthor/network.cosmik.card/stubbedcard',
    source: 'Semble',
    authorHandle: 'sam-curator.example.com',
    authorName: O.some('Sam Curator'),
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    text: 'Added to my collection of papers on organelle communication during cellular stress.',
    href: 'https://semble.example.com/cards/stubbed-card',
    createdAt: new Date('2024-05-08T09:00:00Z'),
  },
];

export const fetchAtprotoMentions: ExternalQueries['fetchAtprotoMentions'] = (history, sources) => TE.right(
  hasStubbedSocialMentions(history)
    ? stubbedMentions.filter((mention) => sources.includes(mention.source))
    : [],
);
