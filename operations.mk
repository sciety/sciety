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

.PHONY: download-exploratory-test-from-prod
download-exploratory-test-from-prod:
	rm -rf "./data/exploratory-test-from-prod.csv"
	kubectl run --rm --attach ship-events \
		--image=amazon/aws-cli:2.4.23 \
		--command=true \
		--restart=Never \
		--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
		--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
		--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
		--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
		--env=AWS_ACCESS_KEY_ID=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."id"'| base64 -d) \
		--env=AWS_SECRET_ACCESS_KEY=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."secret"'| base64 -d) \
		-- \
		bash -c 'yum install --assumeyes --quiet postgresql \
			&& psql -c "COPY (SELECT * FROM events ORDER BY date ASC) TO STDOUT CSV;" > ./events.csv \
			&& aws s3 cp "./events.csv" "s3://sciety-data-extractions/events.csv" \
		'
	aws s3 cp "s3://sciety-data-extractions/events.csv" "./data/exploratory-test-from-prod.csv"

.PHONY: download-exploratory-test-from-staging
download-exploratory-test-from-staging:
	kubectl run --rm --attach ship-events \
		--image=amazon/aws-cli:2.4.23 \
		--command=true \
		--restart=Never \
		--env=PGHOST=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
		--env=PGDATABASE=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
		--env=PGUSER=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
		--env=PGPASSWORD=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d | sed -e 's/\$$\$$/$$$$$$$$/g') \
		--env=AWS_ACCESS_KEY_ID=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."id"'| base64 -d) \
		--env=AWS_SECRET_ACCESS_KEY=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."secret"'| base64 -d) \
		-- \
		bash -c 'yum install --assumeyes --quiet postgresql \
			&& psql -c "COPY (SELECT * FROM events ORDER BY date ASC) TO STDOUT CSV;" > ./events.csv \
			&& aws s3 cp "./events.csv" "s3://sciety-data-extractions/staging-events.csv" \
		'
	aws s3 cp "s3://sciety-data-extractions/staging-events.csv" "./data/exploratory-test-from-staging.csv"

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