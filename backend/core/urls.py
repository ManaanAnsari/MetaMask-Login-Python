from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="REST API",
      default_version='v1',
      description="Testing REST API",
      terms_of_service="https://todaystechworld.com/wp-content/uploads/2021/12/gifdanceparty-prank-websites.gif",
      contact=openapi.Contact(email="rover@mars.elon"),
      license=openapi.License(name="SpaceX Patent sued by Bezos"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
   # path('admin/', admin.site.urls),
   path('api-auth/', include('rest_framework.urls')),
   path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   path('user_svc/', include('user_management.urls'),name="user"),

]