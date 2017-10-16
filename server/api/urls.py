from django.conf.urls import url
from rest_framework.authtoken import views as drf_views
from views import home, device_status

urlpatterns = [
    url(r'^device/(?P<device_id>[0-9]+)/$', device_status, name='device_status'),
    url(r'^', home, name='home'),
    url(r'^auth$', drf_views.obtain_auth_token, name='auth'),
]
