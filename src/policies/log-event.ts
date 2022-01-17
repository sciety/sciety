import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';

const queueUrl = 'http://localhost:4566/000000000000/queue123';

const getMessage = (url: string) => async () => {
  const sqsClient = new SQSClient({ region: 'us-east-1', endpoint: 'http://localhost:4566' });
  const command = new ReceiveMessageCommand({ QueueUrl: url });
  return sqsClient.send(command);
};

const logEvent = (data: ReceiveMessageCommandOutput) => {
  process.stdout.write(JSON.stringify(data));
  return data;
};

const deleteMessageFromQueue = (data: ReceiveMessageCommandOutput) => async () => {
  const sqsClient = new SQSClient({ region: 'us-east-1', endpoint: 'http://localhost:4566' });
  if (data.Messages) {
    const receiptHandle = data.Messages ? data.Messages[0].ReceiptHandle : '';
    const command = new DeleteMessageCommand({ 
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
    await sqsClient.send(command);
  }
};

void (async (): Promise<void> => pipe(
  queueUrl,
  getMessage,
  T.map(logEvent),
  T.chain(deleteMessageFromQueue),
)())();
