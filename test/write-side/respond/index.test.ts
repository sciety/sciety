import { RouterParamContext } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { dummyLogger } from '../../dummy-logger';
import { respondHandler, Ports as RespondHandlerPorts } from '../../../src/write-side/respond';
import { User } from '../../../src/types/user';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';

describe('index', () => {
  it('redirects to review anchor on referer', async () => {
    const context = ({
      request: {
        body: {
          command: 'respond-helpful',
          reviewid: 'hypothesis:bar',
        },
        headers: {
          referer: '/foo',
        },
      },
      state: {
        user: {
          id: arbitraryUserId(),
        },
      },
      redirect: jest.fn(),
    } as unknown) as ParameterizedContext<{ user: User }, RouterParamContext<{ user: User }>>;
    const adapters: RespondHandlerPorts = {
      getAllEvents: async () => [],
      commitEvents: () => T.of('events-created' as const),
      getUser: () => O.some(arbitraryUserDetails()),
      logger: dummyLogger,
    };
    const respond = respondHandler(adapters);
    await respond(context, async () => {});

    expect(context.redirect).toHaveBeenCalledWith('/foo#hypothesis:bar');
  });
});
