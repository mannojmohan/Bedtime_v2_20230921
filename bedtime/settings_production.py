from .settings import *

env_file = os.path.join(BASE_DIR, ".env")

SETTINGS_NAME = "application_settings"

if not os.path.isfile(".env"):
    import google.auth
    from google.cloud import secretmanager as sm

    _, project = google.auth.default()

    if project:
        client = sm.SecretManagerServiceClient()
        secret_path = f"projects/{project}/secrets/{SETTINGS_NAME}/versions/latest"
        payload = client.access_secret_version(request={"name": secret_path}).payload.data.decode("UTF-8")

        with open(env_file, "w") as f:
            f.write(payload)

env = environ.Env()
env.read_env(env_file)

SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", True)
DATABASES = {"default": env.db()}

# django storages config
INSTALLED_APPS += ["storages"]  # for django-storages

# Define static storage via django-storages[google]
GS_BUCKET_NAME = env("GS_BUCKET_NAME")
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
GS_DEFAULT_ACL = "publicRead"

# fix ssl mixed content issues
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Django security checklist settings.
# More details here: https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HTTP Strict Transport Security settings
# Without uncommenting the lines below, you will get security warnings when running ./manage.py check --deploy
# https://docs.djangoproject.com/en/3.2/ref/middleware/#http-strict-transport-security

# # Increase this number once you're confident everything works https://stackoverflow.com/a/49168623/8207
# SECURE_HSTS_SECONDS = 60
# # Uncomment these two lines if you are sure that you don't host any subdomains over HTTP.
# # You will get security warnings if you don't do this.
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

USE_HTTPS_IN_ABSOLUTE_URLS = True

ALLOWED_HOSTS = [
    "*",  # update with your production hosts
]


# Your email config goes here.
# see https://github.com/anymail/django-anymail for more details / examples
# To use mailgun, comment out the lines below and make sure your key and domain
# are available in the environment.
# EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"

# ANYMAIL = {
#     "MAILGUN_API_KEY": env("MAILGUN_API_KEY", default=None),
#     "MAILGUN_SENDER_DOMAIN": env("MAILGUN_SENDER_DOMAIN", default=None),
# }

SERVER_EMAIL = "noreply@localhost:8000"
DEFAULT_FROM_EMAIL = "surajrajapandian@gmail.com"
ADMINS = [
    #("Your Name", "justyna.ilczuk@gmail.com"),
    ("Your Name", "surajrajapandian@gmail.com"),
]

# Mailchimp setup

# set these values if you want to subscribe people to a mailchimp list after they sign up.
MAILCHIMP_API_KEY = env("MAILCHIMP_API_KEY", default=None)
MAILCHIMP_LIST_ID = env("MAILCHIMP_LIST_ID", default=None)
