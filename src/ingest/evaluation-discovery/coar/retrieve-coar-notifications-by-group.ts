import * as TE from 'fp-ts/TaskEither';

export const retrieveCoarNotificationsByGroup = (
  groupIdentification: string,
): TE.TaskEither<string, ReadonlyArray<string>> => {
  if (groupIdentification === 'https://evolbiol.peercommunityin.org/coar_notify/') {
    return TE.right([
      'urn:uuid:0964db9c-c988-4185-891e-0c8a5c79adb9',
      'urn:uuid:13add01f-61b3-4df5-bc7f-ad4ad9fe64f8',
    ]);
  }
  if (groupIdentification === 'https://neuro.peercommunityin.org/coar_notify/') {
    return TE.right([
      'urn:uuid:6d59e586-5c75-417c-ae15-6abdd8030539',
      'urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
    ]);
  }
  return TE.right([]);
};
