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
    api_data = (requests.get('https://lightingroad-api.herokuapp.com/'+code)).json()
    return HttpResponse(str(api_data))
  return render(request, 'main.html')

def saveAvg(request):
  id = request.POST['id']
  print(id)
  avgSum = request.POST['avgSum']
  avgCount = request.POST['avgCount']
  requests.get('https://lightingroad-api.herokuapp.com/avg/' + id + '/' + avgSum + '/' + avgCount + '/')
  return HttpResponse("success")