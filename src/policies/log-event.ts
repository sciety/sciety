import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { pipe } from 'fp-ts/function';

const queueUrl = 'http://localhost:4566/000000000000/queue123';

const foo = (url: string) => async () => {
  const sqsClient = new SQSClient({ region: 'us-east-1', endpoint: 'http://localhost:4566' });
  const command = new ReceiveMessageCommand({ QueueUrl: url });
  const data = await sqsClient.send(command);

  process.stdout.write(JSON.stringify(data));
};

void (async (): Promise<void> => pipe(
  queueUrl,
  foo,
)())();
