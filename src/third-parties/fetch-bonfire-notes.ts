import * as fs from 'fs';
import path from 'path';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { decodeAndLogFailures } from './decode-and-log-failures';
import { ExternalQueries } from './external-queries';
import { Logger } from '../logger';
import { ActivityPubMention } from '../types/activitypub-mention';
import * as DE from '../types/data-error';
import { ExpressionDoi } from '../types/expression-doi';
import * as PH from '../types/publishing-history';

const bonfireNotesDirectory = path.resolve(__dirname, '..', '..', 'data', 'bonfire-activitypub-objects');

const activityPubNoteCodec = t.type({
  type: t.literal('Note'),
  id: t.string,
  url: t.string,
  attributedTo: t.string,
  content: t.string,
  published: tt.DateFromISOString,
}, 'activityPubNoteCodec');

const savedBonfireObjectCodec = t.type({
  bonfireUrl: t.string,
  object: activityPubNoteCodec,
}, 'savedBonfireObjectCodec');

const toActivityPubMention = (
  { bonfireUrl, object }: t.TypeOf<typeof savedBonfireObjectCodec>,
): ActivityPubMention => ({
  id: object.id,
  bonfireUrl,
  url: object.url,
  attributedTo: object.attributedTo,
  content: object.content,
  published: object.published,
});

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const mentions = (note: ActivityPubMention) => (doi: ExpressionDoi) => (
  new RegExp(`${escapeForRegExp(doi)}(?![0-9])`, 'i').test(note.content)
);

export const notesMentioningAnyOf = (
  dois: ReadonlyArray<ExpressionDoi>,
) => (
  notes: ReadonlyArray<ActivityPubMention>,
): ReadonlyArray<ActivityPubMention> => pipe(
  notes,
  RA.filter((note) => dois.some(mentions(note))),
);

const readJsonFiles = (directory: string) => TE.tryCatch(
  async () => {
    const filenames = await fs.promises.readdir(directory);
    return Promise.all(
      filenames
        .filter((filename) => filename.endsWith('.json'))
        .map(async (filename) => fs.promises.readFile(path.join(directory, filename), 'utf8')),
    );
  },
  (error) => error,
);

const parseJson = (contents: string) => E.tryCatch(() => JSON.parse(contents) as unknown, (error) => error);

export const fetchBonfireNotes = (logger: Logger): ExternalQueries['fetchBonfireNotes'] => (history) => pipe(
  readJsonFiles(bonfireNotesDirectory),
  TE.mapLeft((error) => {
    logger('error', 'Failed to read Bonfire notes', { error });
    return DE.unavailable;
  }),
  TE.map((files) => pipe(
    files,
    RA.map((contents) => pipe(
      parseJson(contents),
      E.chainW(decodeAndLogFailures(logger, savedBonfireObjectCodec)),
      E.map(toActivityPubMention),
    )),
    RA.rights,
    notesMentioningAnyOf(PH.getAllExpressionDois(history)),
  )),
);
