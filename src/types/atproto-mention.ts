import * as O from 'fp-ts/Option';

export type AtprotoMention = {
  atUri: string,
  source: 'Bluesky' | 'Semble',
  authorHandle: string,
  authorName: O.Option<string>,
  authorAvatarUrl: O.Option<string>,
  text: string,
  href: string,
  createdAt: Date,
};
