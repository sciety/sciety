export const renderDescription = (articleCount: number, groupCount: number): string => (
  `${articleCount} saved article${articleCount === 1 ? '' : 's'} | ${groupCount} followed group${groupCount === 1 ? '' : 's'}`
);
