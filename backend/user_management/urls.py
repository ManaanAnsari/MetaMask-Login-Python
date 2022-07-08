from django.urls import path
from user_management.views import UserCaptchaView, LoginView, UserMeView

urlpatterns = [
   path('get_captcha/', UserCaptchaView.as_view(),name="captcha"),
   path('web3_login/', LoginView.as_view(),name="login_view"),
   path('me/', UserMeView.as_view(),name="me_view"),   
]