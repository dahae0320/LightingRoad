from django.http import request
from django.http.response import HttpResponse
from django.shortcuts import render

from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote_plus, unquote

# Create your views here.
def streetLampData(code):
  url = 'http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api'

  queryParams = '?' + urlencode({ quote_plus('serviceKey') : unquote('n9Pfhnwdrxh%2FiMJefGgPTp2AqXB6JERmRhzBvdbZHL7Cbneqc7N5j6TxUvNOis9Ri%2Fz0dFdM8jbOYhKcmWj2Qg%3D%3D'),
      quote_plus('pageNo') : '1',
      quote_plus('numOfRows') : '1000',
      # quote_plus('latitude') : lat,
      # quote_plus('longitude') : lng,
      # quote_plus('lnmadr') : '경상남도 진주시 상평동 274-16',
      quote_plus('instt_code') : code,
      quote_plus('type') : 'json'}, encoding='UTF-8', doseq=True)

  request = Request(url + queryParams)
  request.get_method = lambda: 'GET'
  response_body = urlopen(request).read()
  decode_data = response_body.decode('utf-8')
  return decode_data

def mapcenter(request):
  if request.is_ajax and request.method == 'GET':
    lat = request.GET['lat']
    lng = request.GET['lng']
    return HttpResponse([lat, lng])

def main(request):  
  if request.is_ajax and request.method == 'POST':
    code = request.POST['code']
    data = streetLampData(code)  
    return HttpResponse(data)
  return render(request, 'main.html')

def main2(request):
  return render(request, 'main2.html')