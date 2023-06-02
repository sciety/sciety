import * as T from 'fp-ts/Task';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import { SharedPorts } from '../shared-ports';
import { Queries } from '../shared-read-models';
import { Doi } from '../types/doi';
import { ArticleServer } from '../types/article-server';

type ArticleVersion = {
  source: URL,
  publishedAt: Date,
  version: number,
};

export type CollectedPorts = SharedPorts & Queries & {
  findVersionsForArticleDoi: (
    doi: Doi,
    server: ArticleServer,
  ) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>>,
};
