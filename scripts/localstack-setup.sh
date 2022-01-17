 #!/usr/bin/env bash
        
set -euo pipefail
   
# enable debug
# set -x
   
echo "configuring sns/sqs"
echo "==================="
# https://gugsrs.com/localstack-sqs-sns/
LOCALSTACK_HOST=localhost
   
get_all_topics() {
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns list-topics
}
   
create_topic() {
    local TOPIC_NAME_TO_CREATE=$1
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME_TO_CREATE}
}
   
TOPIC_NAME="topic56789"
   
echo "creating topic $TOPIC_NAME"
TOPIC_ARN=$(create_topic ${TOPIC_NAME})
echo "created topic: $TOPIC_ARN"
   
echo "all topics are:"
echo "$(get_all_topics)"
