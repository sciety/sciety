import * as t from 'io-ts';

export const editUserDetailsCommandCodec = t.type({});

export type EditUserDetailsCommand = t.TypeOf<typeof editUserDetailsCommandCodec>;
