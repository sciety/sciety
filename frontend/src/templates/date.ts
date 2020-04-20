const textFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const toString = (date: Date): string => date.toISOString().split('T')[0];
const toDisplayString = (date: Date): string => date.toLocaleDateString(undefined, textFormatOptions);

export default (date: Date): string => (
  `<time datetime="${toString(date)}">${toDisplayString(date)}</time>`
);
