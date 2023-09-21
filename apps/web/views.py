from django.shortcuts import render
from django.utils.translation import gettext_lazy as _


def home(request):
    if request.user.is_authenticated:
        return render(
            request,
            "web/base_internal.tmpl.html",
            context={
                "active_tab": "dashboard",
                "page_title": _("Dashboard"),
            },
        )
    else:
        return render(request, "web/landing_page.html")

def request_recording(request):
    return render(
            request,
            "web/base_internal.tmpl.html",
            context={
                "active_tab": "dashboard",
                "page_title": _("Dashboard"),
            },
        )

def indian_classics(request):
    return render(request, "web/indian_classics.html")

def simulate_error(request):
    raise Exception("This is a simulated error.")
