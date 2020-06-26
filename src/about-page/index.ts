import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import readFile from './read-file';
import renderAboutPage from './render-about-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    readFile('about.md', adapters.fetchStaticFile),
    renderAboutPage(),
  ])
);
