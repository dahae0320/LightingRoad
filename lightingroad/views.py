from django.http import request
from django.http.response import HttpResponse
from django.shortcuts import render

from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote_plus, unquote

import json
import os, requests

# Create your views here.

def main(request):
  proxyDict = {
              "http"  : os.environ.get('FIXIE_URL', ''),
              "https" : os.environ.get('FIXIE_URL', '')
            }
   # r = requests.get('http://www.example.com', proxies=proxyDict)

  if request.is_ajax and request.method == 'POST':
    code = request.POST['code']
    api_data = (requests.get('https://lightingroad-api.herokuapp.com/'+code, proxies=proxyDict)).json()
    return HttpResponse(str(api_data))
  return render(request, 'main.html')

def saveAvg(request):
  proxyDict = {
              "http"  : os.environ.get('FIXIE_URL', ''),
              "https" : os.environ.get('FIXIE_URL', '')
            }

  id = request.POST['id']
  print(id)
  avgSum = request.POST['avgSum']
  avgCount = request.POST['avgCount']
  requests.get('https://lightingroad-api.herokuapp.com/avg/' + id + '/' + avgSum + '/' + avgCount + '/', proxies=proxyDict)
  return HttpResponse("success")