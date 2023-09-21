# helper script to get started with google cloud run
# prerequisites:
# - set PROJECT_ID=[your project ID] and REGION=[your region]
# - create a SQL instance
gcloud sql instances create bedtime_instance --project $PROJECT_ID --database-version POSTGRES_11 --tier db-f1-micro --region $REGION
# create database
gcloud sql databases create bedtime_db --instance bedtime_instance
# create bucket for static files
gsutil mb gs://bedtime-media
# set up secrets in secret manager
gcloud secrets create bedtime_settings --replication-policy automatic
# (create .env.production file here)
gcloud secrets versions add bedtime_settings --data-file .env.production
gcloud secrets add-iam-policy-binding bedtime_settings  --member serviceAccount:${CLOUDRUN} --role roles/secretmanager.secretAccessor
export PROJECTNUM=$(gcloud projects describe ${PROJECT_ID} --format 'value(projectNumber)')
export CLOUDBUILD=${PROJECTNUM}@cloudbuild.gserviceaccount.com
gcloud secrets add-iam-policy-binding bedtime_settings  --member serviceAccount:${CLOUDBUILD} --role roles/secretmanager.secretAccessor
gcloud projects add-iam-policy-binding ${PROJECT_ID}  --member serviceAccount:${CLOUDBUILD} --role roles/cloudsql.client
gcloud builds submit --config cloudmigrate.yaml  --substitutions _REGION=$REGION
gcloud run deploy bedtime-project --platform managed --region $REGION --image gcr.io/$PROJECT_ID/bedtime-cloudrun --add-cloudsql-instances ${PROJECT_ID}:${REGION}:worldbabies-db-staging  --allow-unauthenticated --set-env-vars=DJANGO_SETTINGS_MODULE=bedtime.settings_production  --service-account=cloudrun-serviceaccount@worldbabies-staging.iam.gserviceaccount.com
