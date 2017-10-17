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
				'device_recid': device.device_recid,
				'device_id': device.device_id,
				'device_manufacturer': device.manufacturer,
				'device_description': device.description,
				'device_type': device.device_type,
				'device_mac_address': device.mac_address,
				'device_ip_address': device.ip_address
			}
			
			device_list.append(device_res)
			
		site_res = {
			'site_id': site.site_recid,
			'site_description': site.description,
			'site_address1': site.address1,
			'site_address2': site.address2,
			'site_city': site.city,
			'site_province': site.province,
			'site_postal_code': site.postal_code,
			'site_latitude': site.latitude,
			'site_longitude': site.longitude,
			'site_devices': device_list
		}
	
		site_list.append(site_res)
		
	return HttpResponse(json.dumps(site_list))