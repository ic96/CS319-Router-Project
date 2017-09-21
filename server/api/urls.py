from django.conf.urls import url
from rest_framework.authtoken import views as drf_views
from rest_framework.views import APIView
from rest_framework.response import Response

class APIHome(APIView):

    def get(self, request, format=None):
        return Response('Welcome!')

apihome = APIHome.as_view()

urlpatterns = [
    url(r'^', apihome),
    url(r'^auth$', drf_views.obtain_auth_token, name='auth'),
]
