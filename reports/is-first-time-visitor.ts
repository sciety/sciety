export const isFirstTimeVisitor = (seenBefore: ReadonlyArray<string>, visitorId: string): ReadonlyArray<string> => (
  seenBefore.includes(visitorId) ? seenBefore : seenBefore.concat([visitorId])
);
