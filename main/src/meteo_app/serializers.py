from rest_framework import serializers
from .models import ControllerData


class ControllerDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControllerData
        fields = '__all__'
