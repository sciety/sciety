import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { EditorialCommunity } from '../types/editorial-community';

type FetchStaticFile = (filename: string) => T.Task<string>;

const convertMarkdownToHtml = (md: string): string => new Remarkable({ html: true }).render(md);

type GetDescription = (fetchStaticFile: FetchStaticFile) => (group: EditorialCommunity) => TE.TaskEither<never, string>;

export const getDescription: GetDescription = (fetchStaticFile) => (group) => pipe(
  `groups/${group.descriptionPath}`,
  fetchStaticFile,
  T.map(convertMarkdownToHtml),
  TE.rightTask,
);
