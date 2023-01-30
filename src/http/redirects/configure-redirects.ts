import Router from '@koa/router';
import { permanentRedirect } from './permanent-redirect';
import { Ports as IdToHandlePorts, redirectUserIdToHandle } from './redirect-user-id-to-handle';
import { Ports as UserToGenericListPorts, redirectUserListPageToGenericListPage } from './redirect-user-list-page-to-generic-list-page';

type Ports = IdToHandlePorts & UserToGenericListPorts;

const matchHandle = '[^0-9][^/]+';
const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';

const permanentRedirects: ReadonlyArray<[string, (params: Record<string, string>) => string]> = [
  ['/users/:id/followed-groups', (params) => `/users/${params.id}/following`],
  [`/users/:handle(${matchHandle})/saved-articles`, (params) => `/users/${params.handle}/lists`],
  ['/articles', () => ('/search')],
  ['/articles/:doi(10\\..+)', (params) => `/articles/activity/${params.doi}`],
  ['/groups/:slug/evaluated-articles', (params) => `/groups/${params.slug}`],
  ['/privacy', () => '/legal'],
  ['/terms', () => '/legal'],
  ['/blog', () => 'https://blog.sciety.org'],
  ['/feedback', () => 'http://eepurl.com/hBml3D'],
  ['/contact-us', () => mailChimpUrl],
  ['/subscribe-to-mailing-list', () => 'http://eepurl.com/hBml3D'],
];

export const configureRedirects = (router: Router, adapters: Ports): void => {
  permanentRedirects.map(([url, targetConstructor]) => router.get(url, permanentRedirect(targetConstructor)));

  router.get(
    '/users/:id([0-9]+)/lists',
    redirectUserIdToHandle(adapters, 'lists'),
  );

  router.get(
    '/users/:id([0-9]+)/following',
    redirectUserIdToHandle(adapters, 'following'),
  );

  router.get(
    `/users/:handle(${matchHandle})/lists/saved-articles`,
    redirectUserListPageToGenericListPage(adapters),
  );

  router.get(
    '/users/:id([0-9]+)/lists/saved-articles',
    redirectUserIdToHandle(adapters, 'lists/saved-articles'),
  );
};
