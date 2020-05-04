export default (items: Array<string>): string => (
  items.reduce((carry: string, item: string): string => `${carry}<li>${item}</li>\n`, '')
);
