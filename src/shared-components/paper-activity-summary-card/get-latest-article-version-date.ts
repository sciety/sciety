import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import { ArticleId } from '../../types/article-id';
import { ExternalQueries } from '../../third-parties';
import * as EDOI from '../../types/expression-doi';

export type Ports = {
  findVersionsForArticleDoi: ExternalQueries['findVersionsForArticleDoi'],
};

type GetLatestArticleVersionDate = (
  ports: Ports,
) => (articleDoi: ArticleId, server: ArticleServer) => TO.TaskOption<Date>;

export const getLatestArticleVersionDate: GetLatestArticleVersionDate = (
  ports,
) => (
  articleId, server,
) => pipe(
  ports.findVersionsForArticleDoi(EDOI.fromValidatedString(articleId.value), server),
  T.map(O.map(flow(
    RNEA.last,
    (version) => version.publishedAt,
  ))),
);
