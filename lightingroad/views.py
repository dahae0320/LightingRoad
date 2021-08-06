from django.http import request
from django.http.response import HttpResponse
from django.shortcuts import render

from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote_plus, unquote

import json
import requests

# Create your views here.

def main(request):
  if request.is_ajax and request.method == 'POST':
    code = request.POST['code']
    api_data = (requests.get('http://127.0.0.1:8000/'+code)).json()
    return HttpResponse(str(api_data))
  return render(request, 'main.html')

def saveAvg(request):
  id = request.POST['id']
  print(id)
  avgSum = request.POST['avgSum']
  avgCount = request.POST['avgCount']
  requests.get('http://127.0.0.1:8000/avg/' + id + '/' + avgSum + '/' + avgCount + '/')
  return HttpResponse("success")