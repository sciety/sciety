import { Middleware } from '@koa/router';
import renderAboutPage from './render-about-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  renderAboutPage(adapters.fetchStaticFile)
);
