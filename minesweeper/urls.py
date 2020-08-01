from django.conf.urls import url
from . import views

urlpatterns = [
               url(r'^$', views.index, name='index'),
               url(r'^getgameid$', views.getGameId, name='getgameid'),
               url(r'^checkgameid$', views.gameIdExists, name='checkgameid'),
               url(r'^getvalue$', views.getValue, name='getvalue')
               ]
