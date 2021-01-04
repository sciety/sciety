import { RouterParamContext } from '@koa/router';
import { ParameterizedContext } from 'koa';
import { respondHandler } from '../../src/respond';
import { User } from '../../src/types/user';
import toUserId from '../../src/types/user-id';

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
          id: toUserId('my-user'),
        },
      },
      redirect: jest.fn(),
    } as unknown) as ParameterizedContext<{ user: User }, RouterParamContext<{ user: User }>>;
    const ports = {
      getAllEvents: async () => [],
      commitEvents: async () => {},
    };
    const respond = respondHandler(ports);
    await respond(context, async () => {});

    expect(context.redirect).toHaveBeenCalledWith('/foo#hypothesis:bar');
  });
});
