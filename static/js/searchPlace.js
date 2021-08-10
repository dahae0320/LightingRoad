const searchKeyword = document.querySelector('.searchKeyword');
const searchResult = document.querySelector('.searchResult');

searchKeyword.addEventListener('keyup', searchPlace);

// 검색어 부분이 아닌 다른 외부의 모든 것(document)을 눌렀을 때, 검색 결과창이 사라지도록...
document.addEventListener('click', hideSearchResult);


let markerArr = [];

function searchPlace(event) {
  if (event.key == 'Enter') {
    searchPOI(searchKeyword.value);
    return;
  }

  $(".searchKeyword").on("propertychange keydown paste input", function () {
    searchResult.style.display = 'block';
  });

  $.ajax({
    method: "GET",
    url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
    async: false,
    data: {
      "appKey": "l7xx277bb41e41d345caae019ce5a6c7b6cb",
      "searchKeyword": searchKeyword.value,
      "resCoordType": "EPSG3857",
      "reqCoordType": "WGS84GEO",
      "count": 10,
    },
    success: function (response) {
      if (response != undefined) {
        let resultpoisData = response.searchPoiInfo.pois.poi;
        let innerHtml = "";	// Search Reulsts 결과값 노출 위한 변수

        if (markerArr.length > 0) {
          for (let i in markerArr) {
            markerArr[i].setMap(null);
          }
          markerArr = [];
        }

        for (let k in resultpoisData) {
          let name = resultpoisData[k].name;
          innerHtml += "<li onclick='searchPOI(this.textContent)'>" + name + "</li>";
        }
        searchResult.innerHTML = innerHtml;
      }
    },
    error: function (request, status, error) {
      // console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    }
  });
}



function pressEnter() {
  searchPOI(searchKeyword.value);
}

function hideSearchResult() {
  searchResult.style.display = "none";
}

function moveToSearchPlace(lat, lng) {
  let latLng = new Tmapv2.LatLng(lat, lng);
  map.panTo(latLng);
}

//특정 장소를 검색하는 함수입니다.
function searchPOI(search) {
  hideSearchResult();

  let optionObj = {
    reqCoordType: "WGS84GEO", //요청 좌표계 옵션 설정입니다.
    resCoordType: "WGS84GEO",  //응답 좌표계 옵션 설정입니다.
  };
  let params = {
    onComplete: onComplete,
    onProgress: onProgress,
    onError: onError
  };

  let tData = new Tmapv2.extension.TData();
  tData.getPOIDataFromSearchJson(encodeURIComponent(search), optionObj, params); //encodeURIComponent함수로 해당 파라메터 값을 처리합니다.
}

//POI검색
function onComplete() {
  let lat = this._responseData.searchPoiInfo.pois.poi[0].frontLat;
  let lng = this._responseData.searchPoiInfo.pois.poi[0].frontLon;

  getAddress(lat, lng);
  map.setCenter(new Tmapv2.LatLng(lat, lng));
  let marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
    map: map //Marker가 표시될 Map 설정
  });
  markerArr.push(marker);
  map.setZoom(16);
}
function onProgress() {
}
function onError() {
  alert("onError");
}