import { Middleware, ParameterizedContext } from 'koa';

export const saveSaveArticleCommand: Middleware = async (context: ParameterizedContext, next) => {
  context.session.command = 'save-article';
  context.session.articleId = context.request.body.articleid;
  await next();
};
