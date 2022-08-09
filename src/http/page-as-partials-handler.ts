import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { standardPageLayoutBottomPartial, standardPageLayoutTopPartial } from '../shared-components/standard-page-layout';
import { PageAsPartials } from '../types/page-as-partials';

type PageBuilder = (combinedContext: unknown) => PageAsPartials;

export const pageAsPartialsHandler = (pageBuilder: PageBuilder): Middleware => async (context, next) => {
  const page = pipe(
    {
      ...context.params,
      ...context.query,
      ...context.state,
    },
    pageBuilder,
  );
  const user = O.fromNullable(context.state.user);

  context.response.status = 200;
  context.respond = false;
  context.type = 'text/html';

  context.res.write(await pipe(
    page.title,
    T.map(standardPageLayoutTopPartial(user)),
  )());
  context.res.write(await page.first());
  context.res.write(await page.second());
  context.res.write(standardPageLayoutBottomPartial);
  context.res.end(null);

  await next();
};
