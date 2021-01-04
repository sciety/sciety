import { ParameterizedContext } from 'koa';
import { saveRespondCommand } from '../../src/respond/save-respond-command';

describe('save-respond-command', () => {
  it('stores the reviewId as the targetFragmentId', async () => {
    const context = ({
      request: {
        body: {
          command: '',
          reviewid: 'testId',
        },
      },
      session: {},
      state: {},
    } as unknown) as ParameterizedContext;
    await saveRespondCommand(context, async () => {});

    expect(context.state.targetFragmentId).toBe('testId');
  });
});
