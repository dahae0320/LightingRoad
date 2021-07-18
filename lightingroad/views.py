from django.http import request
from django.http.response import HttpResponse
from django.shortcuts import render

from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote_plus, unquote

# Create your views here.

def streetLampData():
  url = 'http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api'

  queryParams = '?' + urlencode({ quote_plus('serviceKey') : unquote('n9Pfhnwdrxh%2FiMJefGgPTp2AqXB6JERmRhzBvdbZHL7Cbneqc7N5j6TxUvNOis9Ri%2Fz0dFdM8jbOYhKcmWj2Qg%3D%3D'),
      quote_plus('pageNo') : '0',
      quote_plus('numOfRows') : '100',
      quote_plus('type') : 'json'}, encoding='UTF-8', doseq=True)

  request = Request(url + queryParams)
  request.get_method = lambda: 'GET'
  response_body = urlopen(request).read()
  decode_data = response_body.decode('utf-8')
  # print(decode_data)
  return decode_data

def mapcenter(request):
  if request.is_ajax and request.method == 'GET':
    lat = request.GET['lat']
    lng = request.GET['lng']
    return HttpResponse([lat, lng])

def main(request):
  data = streetLampData()
  if request.is_ajax and request.method == 'POST':
    lat = request.POST['lat']
    lng = request.POST['lng']
    print(lat)
    # return render(request, 'main.html', {'data':data})
    return HttpResponse(data)
  return render(request, 'main.html', {'data':data})

def main2(request):
  return render(request, 'main2.html')