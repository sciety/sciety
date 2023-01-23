import { ParameterizedContext } from 'koa';
import * as O from 'fp-ts/Option';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { finishRespondCommand } from '../../../src/write-side/respond/finish-respond-command';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('finish-respond-command', () => {
  describe('when there is no respond command to finish', () => {
    it('does not change the context', async () => {
      const originalContext = ({
        session: {
          command: 'something-else',
        },
      } as unknown) as ParameterizedContext;

      const context = ({
        session: {
          command: 'something-else',
        },
        state: {
          user: {
            id: 'an-id', // TODO should not be needed for this test
          },
        },
      } as unknown) as ParameterizedContext;

      await finishRespondCommand({
        commitEvents: shouldNotBeCalled,
        getAllEvents: shouldNotBeCalled,
        getUser: () => O.some(arbitraryUserDetails()),
        logger: dummyLogger,
      })(context, jest.fn());

      expect(context.session).toStrictEqual(originalContext.session);
    });
  });
});
