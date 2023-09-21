#!/bin/bash
# Build and deploy environment.
export PROJECT_ID=summer-drive-387517
export REGION=us-central1
echo gcloud config set project ${PROJECT_ID}
gcloud config set project ${PROJECT_ID}

gcloud builds submit --config cloudmigrate_prod.yaml  --substitutions _REGION=$REGION
gcloud run deploy bedtime-project --platform managed --region $REGION --image gcr.io/$PROJECT_ID/bedtime-cloudrun --add-cloudsql-instances ${PROJECT_ID}:${REGION}:worldbabies-db-prod  --allow-unauthenticated --set-env-vars=DJANGO_SETTINGS_MODULE=bedtime.settings_production  --service-account=cloudrun-serviceaccount@${PROJECT_ID}.iam.gserviceaccount.com
