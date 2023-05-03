import * as t from 'io-ts';

export const eraseEvaluationCommandCodec = t.type({

});

export type EraseEvaluationCommand = t.TypeOf<typeof eraseEvaluationCommandCodec>;
