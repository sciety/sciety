import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { CollectedPorts } from '../../infrastructure';
import * as GAP from '../../read-side/html-pages/group-page/group-about-page';
import { addAFeaturedListFormPage } from '../../read-side/html-pages/group-page/group-add-a-featured-list-form-page';
import * as GFP from '../../read-side/html-pages/group-page/group-followers-page';
import * as GHP from '../../read-side/html-pages/group-page/group-home-page';
import * as GLP from '../../read-side/html-pages/group-page/group-lists-page';
import { groupPagePathSpecification, groupSubPagePathSpecification } from '../../read-side/paths';
import { createPageFromParams } from '../create-page-from-params';
import { pageHandler } from '../page-handler';
import { requireLoggedInUser } from '../require-logged-in-user';

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  router.get(
    groupPagePathSpecification,
    pageHandler(adapters, createPageFromParams(
      GHP.paramsCodec,
      GHP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    groupSubPagePathSpecification('lists'),
    pageHandler(adapters, createPageFromParams(
      GLP.paramsCodec,
      GLP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    groupSubPagePathSpecification('about'),
    pageHandler(adapters, createPageFromParams(
      GAP.paramsCodec,
      GAP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    groupSubPagePathSpecification('followers'),
    pageHandler(adapters, createPageFromParams(
      GFP.paramsCodec,
      GFP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    groupSubPagePathSpecification('feed'),
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/groups/${context.params.slug}`);

      await next();
    },
  );

  router.get(
    groupSubPagePathSpecification('add-a-featured-list'),
    requireLoggedInUser(adapters),
    pageHandler(adapters, addAFeaturedListFormPage(adapters)),
  );
};
