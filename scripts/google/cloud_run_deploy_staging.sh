#!/bin/bash
# Build and deploy staging environment.
export PROJECT_ID=worldbabies-staging
export REGION=us-central1
gcloud config set project ${PROJECT_ID}

gcloud builds submit --config cloudmigrate_staging.yaml  --substitutions _REGION=$REGION
gcloud run deploy bedtime-project --platform managed --region $REGION --image gcr.io/$PROJECT_ID/bedtime-cloudrun --add-cloudsql-instances ${PROJECT_ID}:${REGION}:worldbabies-db-staging  --allow-unauthenticated --set-env-vars=DJANGO_SETTINGS_MODULE=bedtime.settings_production  --service-account=cloudrun-serviceaccount@${PROJECT_ID}.iam.gserviceaccount.com
