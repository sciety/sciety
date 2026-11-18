export type ActivityPubMention = {
  id: string,
  source: 'Bonfire' | 'Mastodon',
  href: string,
  attributedTo: string,
  content: string,
  published: Date,
};
