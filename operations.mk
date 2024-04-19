.PHONY: trigger-ingestion
trigger-ingestion:  ## Force a run of the ingestion job in production
	scripts/trigger-ingestion.sh

.PHONY: staging-sql
staging-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d | sed -e 's/\$$\$$/$$$$$$$$/g') \
	-- psql

.PHONY: prod-sql
prod-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
	-- psql

./data/exploratory-test-from-prod.csv:
	aws s3 cp "s3://sciety-data-extractions/sciety--prod--events-from-cronjob.csv" "$@"

.PHONY: download-exploratory-test-from-prod
download-exploratory-test-from-prod: ./data/exploratory-test-from-prod.csv

./data/exploratory-test-from-staging.csv:
	aws s3 cp "s3://sciety-data-extractions/sciety--prod--events-from-cronjob.csv" "$@"

.PHONY: download-exploratory-test-from-staging
download-exploratory-test-from-staging: ./data/exploratory-test-from-staging.csv

.PHONY: replace-staging-database-with-snapshot-from-prod
replace-staging-database-with-snapshot-from-prod: download-exploratory-test-from-prod
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d | sed -e 's/\$$\$$/$$$$$$$$/g') \
	-- sleep 600
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "DELETE FROM events"
	kubectl exec psql -- mkdir /data
	kubectl cp ./data/exploratory-test-from-prod.csv psql:/data/exploratory-test-from-prod.csv
	kubectl exec psql -- psql -c "\copy events FROM '/data/exploratory-test-from-prod.csv' WITH CSV"
	kubectl delete --wait=false pod psql
	kubectl rollout restart deployment sciety--staging--frontend

.PHONY: connect-to-cache
connect-to-cache:
	kubectl run --namespace default redis-client --tty -i --rm --image redis -- bash

.PHONY: connect-to-cache-dev
connect-to-cache-dev:
	docker run --tty -i --rm --network sciety_default redis bash

.PHONY: clean-db-dumps
clean-db-dumps:
	rm -rf "./data/exploratory-test-from-prod.csv"
	rm -rf "./data/exploratory-test-from-staging.csv"
