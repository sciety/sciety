export type AtprotoMention = {
  atUri: string,
  source: 'Bluesky' | 'Semble',
  authorHandle: string,
  text: string,
  href: string,
  createdAt: Date,
};
