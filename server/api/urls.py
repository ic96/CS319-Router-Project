from django.conf.urls import url
from rest_framework.authtoken import views as drf_views
from views import Home, device_status, customer_devices, device_history, login, last_success_pings

urlpatterns = [
    url(r'^userlogin/$', login, name='userlogin'),
    url(r'^device/(?P<device_id>[0-9]+)/$', device_status, name='device_status'),
	url(r'^userdevices/(?P<customer_id>[0-9]+)/$', customer_devices, name='customer_devices'),
    url(r'^devicehistory/(?P<device_id>[0-9]+)/$', device_history, name='device_history'),
    url(r'^lastsuccesspings/(?P<device_id>[0-9]+)/$', last_success_pings, name='last_success_pings'),
    url(r'^', Home.as_view(), name='home'),
    url(r'^auth$', drf_views.obtain_auth_token, name='auth'),
]
