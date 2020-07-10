import { Middleware } from '@koa/router';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import reviews from './reviews';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    bodyParser({ enableTypes: ['form'] }),
    reviews(adapters.reviewReferenceRepository, adapters.editorialCommunities),
  ])
);
