from inspect import signature
from rest_framework import serializers

class LoginPostValidator(serializers.Serializer):
    signature = serializers.CharField()
    web3_address = serializers.CharField()
    