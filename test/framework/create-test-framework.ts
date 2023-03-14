import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers';
import { FetchArticle } from '../../src/shared-ports';
import { ArticleServer } from '../../src/types/article-server';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryString } from '../helpers';

type HappyPathThirdPartyAdapters = {
  fetchArticle: FetchArticle,
};

const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
});

export type TestFramework = ReadAndWriteSides & {
  commandHelpers: CommandHelpers,
  happyPathThirdParties: HappyPathThirdPartyAdapters,
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  return {
    ...framework,
    commandHelpers: createCommandHelpers(framework.commandHandlers),
    happyPathThirdParties: createHappyPathThirdPartyAdapters(),
  };
};
