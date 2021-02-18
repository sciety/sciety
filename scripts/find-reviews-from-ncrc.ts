void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');
  const ncrcReviews = [{
    date: '2021-02-04',
    doi: '10.1101/2021.01.29.21250653',
    id: '0c88338d-a401-40f9-8bf8-ef0a43be4548',
  }];
  ncrcReviews.forEach((ncrcReview) => {
    process.stdout.write(`${ncrcReview.date},${ncrcReview.doi},ncrc:${ncrcReview.id}\n`);
  });
})();
