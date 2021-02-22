import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { EditorialCommunity } from '../types/editorial-community';

type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

const convertMarkdownToHtml = (md: string): string => new Remarkable({ html: true }).render(md);

type GetDescription = (fetchStaticFile: FetchStaticFile) => (group: EditorialCommunity) => TE.TaskEither<'not-found' | 'unavailable', string>;

export const getDescription: GetDescription = (fetchStaticFile) => (group) => pipe(
  `groups/${group.descriptionPath}`,
  fetchStaticFile,
  TE.map(convertMarkdownToHtml),
);
