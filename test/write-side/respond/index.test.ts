import { RouterParamContext } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { respondHandler, Ports as RespondHandlerPorts } from '../../../src/write-side/respond';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { UserId } from '../../../src/types/user-id';

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
    } as unknown) as ParameterizedContext<{ user: { id: UserId } }, RouterParamContext<{ user: { id: UserId } }>>;
    const adapters: RespondHandlerPorts = {
      getAllEvents: async () => [],
      commitEvents: () => T.of('events-created' as const),
      lookupUser: () => O.some(arbitraryUserDetails()),
    };
    const respond = respondHandler(adapters);
    await respond(context, async () => {});

    expect(context.redirect).toHaveBeenCalledWith('/foo#hypothesis:bar');
  });
});
