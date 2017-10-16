# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, Http404
import models
import json
# Create your views here.

def home(request):
    print('called this')
    return HttpResponse('Hello World')

def device_status(request, device_id):
    print('called')
    print('Called with {0}'.format(device_id))
    # get the latest status report
    data_capture = models.MspDataCapture.objects.filter(device_recid=device_id).latest('date_recorded')
    device = data_capture.device_recid

    print('Device id = {0}'.format(device.device_recid))
    print('IP Address = {0}'.format(device.ip_address))
    print('Latency = {0}'.format(data_capture.latency_milliseconds))
    res = {
        'device_id': device.device_recid,
        'ip_address': device.ip_address,
        'latency': float(data_capture.latency_milliseconds),
    }

    return HttpResponse(json.dumps(res))
