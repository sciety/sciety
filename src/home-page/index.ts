import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import renderHomePage from './render-home-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    renderHomePage(adapters.editorialCommunities),
  ])
);
