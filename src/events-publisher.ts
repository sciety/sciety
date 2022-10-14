void (async (): Promise<void> => {
  process.stdout.write('I am the events publisher.\n');
  await new Promise((resolve) => { setTimeout(resolve, 60 * 60 * 1000); });
})();
