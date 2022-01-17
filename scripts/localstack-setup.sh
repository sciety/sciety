 #!/usr/bin/env bash
        
set -euo pipefail
   
# enable debug
# set -x
   
echo "configuring sns/sqs"
echo "==================="
# https://gugsrs.com/localstack-sqs-sns/
LOCALSTACK_HOST=localhost
LOCALSTACK_DUMMY_ID=000000000000
   
get_all_topics() {
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns list-topics
}
   
create_topic() {
    local TOPIC_NAME_TO_CREATE=$1
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME_TO_CREATE}
}

guess_topic_arn_from_name() {
    local TOPIC_NAME=$1
    echo "arn:aws:sns:${AWS_DEFAULT_REGION}:${LOCALSTACK_DUMMY_ID}:${TOPIC_NAME}"
}

get_all_queues() {
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs list-queues
}
   
   
create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE}
}

link_queue_and_topic() {
    local TOPIC_ARN_TO_LINK=$1
    local QUEUE_ARN_TO_LINK=$2
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${TOPIC_ARN_TO_LINK} --protocol sqs --notification-endpoint ${QUEUE_ARN_TO_LINK}
}
   
guess_queue_arn_from_name() {
    local QUEUE_NAME=$1
    echo "arn:aws:sns:${AWS_DEFAULT_REGION}:${LOCALSTACK_DUMMY_ID}:$QUEUE_NAME"
}
   
TOPIC_NAME="topic56789"
QUEUE_NAME="queue123"
   
echo "creating topic $TOPIC_NAME"
create_topic $TOPIC_NAME
TOPIC_ARN=$(guess_topic_arn_from_name $TOPIC_NAME)
echo "created topic: $TOPIC_ARN"

echo "creating queue $QUEUE_NAME"
QUEUE_URL=$(create_queue ${QUEUE_NAME})
echo "created queue: $QUEUE_URL"
QUEUE_ARN=$(guess_queue_arn_from_name $QUEUE_NAME)
   
echo "linking topic $TOPIC_ARN to queue $QUEUE_ARN"
LINKING_RESULT=$(link_queue_and_topic $TOPIC_ARN $QUEUE_ARN)
echo "linking done:"
echo "$LINKING_RESULT"
   
echo "all topics are:"
echo "$(get_all_topics)"
echo "all queues are:"
echo "$(get_all_queues)"
