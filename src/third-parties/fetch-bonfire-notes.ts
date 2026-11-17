import { Buffer } from 'buffer';
import { createSign } from 'crypto';
import { URL } from 'url';
import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructHeadersWithUserAgent } from './construct-headers-with-user-agent';
import { decodeAndLogFailures } from './decode-and-log-failures';
import { ExternalQueries } from './external-queries';
import { Logger } from '../logger';
import { ActivityPubMention } from '../types/activitypub-mention';
import * as DE from '../types/data-error';
import * as EDOI from '../types/expression-doi';
import * as PH from '../types/publishing-history';

const bonfirePosts: ReadonlyArray<{ url: string, dois: ReadonlyArray<EDOI.ExpressionDoi> }> = [
  {
    url: 'https://bonfire.cafe/pub/objects/01M74PBFVRXXJ03A0QT56XFSWM',
    dois: [
      EDOI.fromValidatedString('10.64898/2026.09.11.751004'),
    ],
  },
  {
    url: 'https://bonfire.cafe/pub/objects/01M6ZWRSBGF4A8HGDDEBE8KNFG',
    dois: [
      EDOI.fromValidatedString('10.64898/2026.06.08.730984'),
      EDOI.fromValidatedString('10.1101/2025.07.11.664448'),
    ],
  },
];

const activityPubNoteCodec = t.type({
  type: t.literal('Note'),
  id: t.string,
  url: t.string,
  attributedTo: t.string,
  content: t.string,
  published: tt.DateFromISOString,
}, 'activityPubNoteCodec');

type ActivityPubNote = t.TypeOf<typeof activityPubNoteCodec>;

const toActivityPubMention = (bonfireUrl: string) => (note: ActivityPubNote): ActivityPubMention => ({
  id: note.id,
  bonfireUrl,
  url: note.url,
  attributedTo: note.attributedTo,
  content: note.content,
  published: note.published,
});

const signedHeaders = (url: string, privateKeyPem: string): Record<string, string> => {
  const { host, pathname } = new URL(url);
  const date = new Date().toUTCString();
  const signingString = `(request-target): get ${pathname}\nhost: ${host}\ndate: ${date}`;
  const signature = createSign('sha256').update(signingString).sign(privateKeyPem, 'base64');
  const keyId = process.env.ACTIVITYPUB_KEY_ID
    ?? `${process.env.APP_ORIGIN ?? 'https://sciety.org'}/activitypub/actor#main-key`;
  return {
    Host: host,
    Date: date,
    Accept: 'application/activity+json',
    Signature: `keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) host date",signature="${signature}"`,
  };
};

const fetchNote = (logger: Logger, privateKeyPem: string) => (url: string) => pipe(
  TE.tryCatch(
    async () => axios.get<unknown>(url, {
      headers: constructHeadersWithUserAgent(signedHeaders(url, privateKeyPem)),
      timeout: 5000,
    }),
    (error) => {
      logger('error', 'Failed to fetch Bonfire note', { url, error: axios.isAxiosError(error) ? error.message : String(error) });
      return DE.unavailable;
    },
  ),
  TE.chainEitherKW((response) => decodeAndLogFailures(logger, activityPubNoteCodec)(response.data)),
  TE.map(toActivityPubMention(url)),
);

const decodeBase64 = (value: string) => Buffer.from(value, 'base64').toString('utf8');

export const fetchBonfireNotes = (logger: Logger): ExternalQueries['fetchBonfireNotes'] => (history) => {
  const dois = PH.getAllExpressionDois(history);
  const relevantPostUrls = pipe(
    bonfirePosts,
    RA.filter((post) => post.dois.some((doi) => dois.includes(doi))),
    RA.map((post) => post.url),
  );
  if (relevantPostUrls.length === 0) {
    return TE.right([]);
  }
  const privateKey = process.env.ACTIVITYPUB_PRIVATE_KEY;
  if (privateKey === undefined || privateKey === '') {
    logger('warn', 'ACTIVITYPUB_PRIVATE_KEY is not set; Bonfire notes cannot be fetched');
    return TE.right([]);
  }
  return pipe(
    relevantPostUrls,
    T.traverseArray(fetchNote(logger, decodeBase64(privateKey))),
    T.map(RA.rights),
    T.map(E.right),
  );
};
