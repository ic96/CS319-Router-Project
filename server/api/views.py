# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf import settings
from django.http import HttpResponse, HttpResponseNotFound, Http404
from django.shortcuts import render
from django.views.generic import View

import datetime
import json
import logging
import models
import os
# Create your views here.

class Home(View):

    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())

        except:
            logging.exception('Production build not found')
            return HttpResponse(
                """
                This URL is only accessible when the production server is built.
                Navigate to client -> npm start -> navigate to
                http://localhost:3000 instead.
                """
            )

# very flaky api, not sure what happens if invalid username and shit but if password is invalid then gg
def login(request):
    # todo: error handling
    params = request.GET
    print(request.GET)
    print(request.GET['username'])
    print(request.GET['password'])
    username = params['username']
    password = params['password']
    credentials = models.MspCompany.objects.filter(username=username)[0];
    print(credentials)
    if credentials.password == password:
        return HttpResponse(credentials.company_recid)
    else:
        return HttpResponse(None)

def device_history(request, device_id):
    print('Called device_history with {0}'.format(device_id))
    data_capture = models.MspDataCapture.objects.filter(device_recid=device_id).order_by('-id')[:30]
    data_capture = reversed(data_capture)

    res = [{
        'device_id': device_data.device_recid.device_recid,
        'device_name': device_data.device_recid.device_id,
        'ip_address': device_data.device_recid.ip_address,
        'latency': float(device_data.latency_milliseconds),
        'date_recorded': device_data.date_recorded.isoformat(),
    } for device_data in data_capture]
    return HttpResponse(json.dumps(res))

def device_status(request, device_id):
    print('called')
    print('Called with {0}'.format(device_id))
    # get the latest status report
    data_capture = models.MspDataCapture.objects.filter(device_recid=device_id).latest('id')
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

def customer_devices(request, customer_id):
	sites = models.MspSite.objects.filter(company_recid=customer_id)
	site_list = []
	for site in sites:
		site_id = site.site_recid
		site_description = site.description
		site_address1 = site.address1
		site_address2 = site.address2
		site_city = site.city
		site_province = site.province
		site_postal_code = site.postal_code
		site_latitude = site.latitude
		site_longitude = site.longitude

		devices = models.MspDevice.objects.filter(site_recid=site_id)
		device_list = []
		for device in devices:
			device_recid = device.device_recid
			device_id = device.device_id
			device_manufacturer = device.manufacturer
			device_description = device.description
			device_type = device.device_type
			device_mac_address = device.mac_address
			device_ip_address = device.ip_address

			device_res = {
				'device_recid': device_recid,
				'device_id': device_id,
				'device_manufacturer': device_manufacturer,
				'device_description': device_description,
				'device_type': device_type,
				'device_mac_address': device_mac_address,
				'device_ip_address': device_ip_address
			}

			device_list.append(device_res)

		site_res = {
			'site_id': site_id,
			'site_description': site_description,
			'site_address1': site_address1,
			'site_address2': site_address2,
			'site_city': site_city,
			'site_province': site_province,
			'site_postal_code': site_postal_code,
			'site_latitude': site_latitude,
			'site_longitude': site_longitude,
			'site_devices': device_list
		}

		site_list.append(site_res)

	return HttpResponse(json.dumps(site_list))

def last_success_pings(request, device_id):
    pings = models.MspDataCapture.objects.filter(device_recid=device_id).order_by('-id')[:5]
    isSuccess = True

    for ping in pings:
        if (not ping.responded):
            isSuccess = False

    res = {
        'isSuccess': isSuccess,
        'device_recid': device_id
    }
    return HttpResponse(json.dumps(res))