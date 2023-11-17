import { ParameterizedContext } from 'koa';
import { ClientClassification } from '../shared-components/head.js';

export const detectClientClassification = (context: ParameterizedContext): ClientClassification => ({
  userAgent: context.req.headers['user-agent'],
});
