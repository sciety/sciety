import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { EditorialCommunity } from '../types/editorial-community';

type FetchStaticFile = (filename: string) => T.Task<string>;

const convertMarkdownToHtml = (md: string): string => new Remarkable({ html: true }).render(md);

type GetDescription = (fetchStaticFile: FetchStaticFile) => (community: EditorialCommunity) => T.Task<string>;

export const getDescription: GetDescription = (fetchStaticFile) => (editorialCommunity) => pipe(
  `editorial-communities/${editorialCommunity.descriptionPath}`,
  fetchStaticFile,
  T.map(convertMarkdownToHtml),
);
