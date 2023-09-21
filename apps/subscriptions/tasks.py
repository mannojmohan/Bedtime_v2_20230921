from celery import shared_task
from stripe.error import StripeError

from apps.users.models import CustomUser

from .helpers import sync_subscription_model_with_stripe


@shared_task
def sync_subscriptions_task():
    for user in CustomUser.get_items_needing_sync():
        try:
            sync_subscription_model_with_stripe(user)
        except StripeError as e:
            from sentry_sdk import capture_exception

            capture_exception(e)
