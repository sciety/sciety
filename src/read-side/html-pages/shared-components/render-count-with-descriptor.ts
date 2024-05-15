export const renderCountWithDescriptor = (
  count: number,
  singularDescriptor: string,
  pluralDescriptor: string,
): string => `${count} ${count === 1 ? singularDescriptor : pluralDescriptor}`;
