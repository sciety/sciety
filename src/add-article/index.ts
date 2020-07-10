import { Middleware } from '@koa/router';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import reviews from './reviews';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  reviewReferenceRepository: ReviewReferenceRepository;
  editorialCommunities: EditorialCommunityRepository;
}

export default (ports: Ports): Middleware => (
  compose([
    bodyParser({ enableTypes: ['form'] }),
    reviews(ports.reviewReferenceRepository, ports.editorialCommunities),
  ])
);
