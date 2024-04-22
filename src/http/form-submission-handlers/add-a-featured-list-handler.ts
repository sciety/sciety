import { Middleware } from 'koa';
import { Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { Logger } from '../../shared-ports';
import { Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  logger: Logger,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addAFeaturedListHandler = (adapters: Ports): Middleware => async (context) => {
};
