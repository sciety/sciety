import * as PR from 'io-ts/PathReporter';
import axios from 'axios';
import { flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { listCodec } from '../src/types/list';

const responseCodec = t.type({
  data: t.type({
    items: tt.nonEmptyArray(listCodec),
  }),
});

const fetchFirstListOwnedBy = async (ownerId: string): Promise<string> => pipe(
  TE.tryCatch(
    async () => axios.get(`http://localhost:8080/api/lists/owned-by/${ownerId}`),
    String,
  ),
  TE.chainEitherK(flow(
    responseCodec.decode,
    E.mapLeft((errors) => PR.failure(errors).join('')),
  )),
  TE.map((response) => response.data),
  TE.match(
    (error) => { throw new Error(error); },
    (response) => response.items[0].id,
  ),
)();

export const getFirstListOwnedByUser = async (userId: string): Promise<string> => (
  fetchFirstListOwnedBy(`user-id:${userId}`)
);

export const getFirstListOwnedByGroup = async (groupId: string): Promise<string> => (
  fetchFirstListOwnedBy(`group-id:${groupId}`)
);
