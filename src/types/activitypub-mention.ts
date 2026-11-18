import * as O from 'fp-ts/Option';

export type ActivityPubAuthor = {
  displayName: string,
  handle: string,
  avatarUrl: O.Option<string>,
};

export type ActivityPubMention = {
  id: string,
  source: 'Bonfire' | 'Mastodon',
  href: string,
  attributedTo: string,
  author: O.Option<ActivityPubAuthor>,
  content: string,
  published: Date,
};
