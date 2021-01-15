import * as T from 'fp-ts/lib/Task';
import { Remarkable } from 'remarkable';
import { EditorialCommunity } from '../types/editorial-community';

type FetchStaticFile = (filename: string) => T.Task<string>;

type GetDescription = (fetchStaticFile: FetchStaticFile) => (community: EditorialCommunity) => T.Task<string>;

export const getDescription: GetDescription = (fetchStaticFile) => (editorialCommunity) => async () => {
  const converter = new Remarkable({ html: true });
  const markdown = await fetchStaticFile(`editorial-communities/${editorialCommunity.descriptionPath}`)();
  return converter.render(markdown);
};
