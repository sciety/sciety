import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

const groupSlugToEvaluatedArticlesListId: Record<string, string> = {
  elife: 'f1561c0f-d247-4e03-934d-52ad9e0aed2f',
  'biophysics-colab': 'ee7e738a-a1f1-465b-807c-132d273ca952',
  'asapbio-crowd-review': 'dc83aa3b-1691-4356-b697-4257d31a27dc',
  ncrc: '4654fd6e-cb00-458f-967b-348b41804927',
  'rapid-reviews-covid-19': '49e589f1-531d-4447-92b6-e60b6d1c705e',
  screenit: 'e9606e0e-8fdb-4336-a24a-cc6547d7d950',
  prelights: 'f4b96b8b-db49-4b41-9c5b-28d66a83cd70',
  prereview: '5c2e4b99-f5f0-4145-8c87-cadd7a41a1b1',
  peerj: 'f981342c-bf38-4dc8-9569-acda5878c07b',
  'review-commons': 'f3dbc188-e891-4586-b267-c99cf3b3808e',
  'pci-zoology': 'a4d57b30-b41c-4c9d-81f0-dccd4cd1d099',
  'pci-evolutionary-biology': '3d69f9e5-6fd2-4266-9cf8-c069bca79617',
  'pci-ecology': '65f661e6-73f9-43e9-9ae6-a84635afb79a',
  'pci-animal-science': 'e764d90c-ffea-4b0e-a63e-d2b5236aa1ed',
  'pci-archaeology': '24a60cf9-5f45-43f2-beaf-04139e6f0a0e',
  'pci-paleontology': 'dd9d166f-6d25-432c-a60f-6df33ca86897',
  'pci-neuroscience': 'f2ce72ba-a982-4156-ab34-4a536bd86cb7',
  peerref: 'c5cf299c-2097-4f3d-b362-2475d7bd35cd',
};

export const redirectEvaluatedArticlesToListsPage: Middleware = async (context, next) => {
  pipe(
    groupSlugToEvaluatedArticlesListId,
    R.lookup(context.params.slug),
    O.fold(
      () => {
        context.status = StatusCodes.NOT_FOUND;
      },
      (listId) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/lists/${listId}`);
      },
    ),
  );

  await next();
};
