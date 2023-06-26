#! /bin/sh

kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(20)"]
      restartPolicy: Never
  backoffLimit: 4
EOF
