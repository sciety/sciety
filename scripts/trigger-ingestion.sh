#! /bin/sh

set -e

case "$TARGET_ENVIRONMENT" in
  "staging")
    ;;
  "prod")
    ;;
  *)
    echo "TARGET_ENVIRONMENT must be one of 'staging' or 'prod'" >&2
    exit 1
esac

env_var() {
  kubectl get cronjobs.batch sciety--${TARGET_ENVIRONMENT}--ingestion -o json | \
    jq -r '.spec.jobTemplate.spec.template.spec.containers[0].env[] | select (.name | contains("'$1'")) | .value'
}

image=$(kubectl get cronjobs.batch sciety--${TARGET_ENVIRONMENT}--ingestion -o json | \
  jq -r '.spec.jobTemplate.spec.template.spec.containers[0].image')
crossref_api_bearer_token=$(env_var "CROSSREF_API_BEARER_TOKEN")
sciety_team_api_bearer_token=$(env_var "SCIETY_TEAM_API_BEARER_TOKEN")
ingestion_target_app=$(env_var "INGESTION_TARGET_APP")
prelights_feed_key=$(env_var "PRELIGHTS_FEED_KEY")
experiment_enabled=$(env_var "EXPERIMENT_ENABLED")

kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: ingestion-backfill--$TARGET_ENVIRONMENT
spec:
  template:
    metadata:
      labels:
        app.kubernetes.io/component: ingestion-backfill
        app.kubernetes.io/instance: sciety--$TARGET_ENVIRONMENT
    spec:
      containers:
      - name: app
        image: "$image"
        command: ["sh", "-c", "node ./build/ingest/update-event-data"]
        env:
          - name: CROSSREF_API_BEARER_TOKEN
            value: "$crossref_api_bearer_token"
          - name: SCIETY_TEAM_API_BEARER_TOKEN
            value: "$sciety_team_api_bearer_token"
          - name: INGESTION_TARGET_APP
            value: "$ingestion_target_app"
          - name: PRELIGHTS_FEED_KEY
            value: "$prelights_feed_key"
          - name: EXPERIMENT_ENABLED
            value: "$experiment_enabled"
          - name: INGEST_DAYS
            value: "${INGEST_DAYS:-5}"
        volumeMounts:
          - name: gcp-ncrc-key
            mountPath: "/var/run/secrets/app"
            readOnly: true
      volumes:
        - name: gcp-ncrc-key
          secret:
            secretName: ncrc-sheet-key
      restartPolicy: Never
  backoffLimit: 4
EOF
