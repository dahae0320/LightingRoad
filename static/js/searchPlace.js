// 2. POI 통합 검색 API 요청
const searchKeyword = document.querySelector('.searchKeyword');
const searchResult = document.querySelector('.searchResult');

searchKeyword.addEventListener('keyup', searchPlace);
// searchKeyword.addEventListener('click', () => {
//   if (searchKeyword.value !== '' || searchResult.style.display == 'none') {
//     searchResult.style.display = 'block';
//   }
// });
document.addEventListener('click', hideSearchResult);


function searchPlace() {
  if (searchResult.style.display == 'none') {
    searchResult.style.display = 'block';
  }

  $.ajax({
    method: "GET",
    url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
    async: false,
    data: {
      "appKey": "l7xx277bb41e41d345caae019ce5a6c7b6cb",
      "searchKeyword": searchKeyword.value,
      "resCoordType": "EPSG3857",
      "reqCoordType": "WGS84GEO",
      "count": 10
    },
    success: function (response) {
      if (response != undefined) {
        let resultpoisData = response.searchPoiInfo.pois.poi;
        let innerHtml = "";	// Search Reulsts 결과값 노출 위한 변수

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
  var optionObj = {
    reqCoordType: "WGS84GEO", //요청 좌표계 옵션 설정입니다.
    resCoordType: "WGS84GEO",  //응답 좌표계 옵션 설정입니다.
    // centerLon: 126.925356, //POI검색시 중앙좌표의 경도입니다.
    // centerLat: 37.554034	//POI검색시 중앙좌표의 위도입니다. 
  };
  var params = {
    onComplete: onComplete,
    onProgress: onProgress,
    onError: onError
  };
  var tData = new Tmapv2.extension.TData();
  tData.getPOIDataFromSearchJson(encodeURIComponent(search), optionObj, params);//encodeURIComponent함수로 해당 파라메터 값을 처리합니다.
}

//POI검색
function onComplete() {
  let lat = this._responseData.searchPoiInfo.pois.poi[0].frontLat;
  let lng = this._responseData.searchPoiInfo.pois.poi[0].frontLon;

  getAddress(lat, lng);
  map.setCenter(new Tmapv2.LatLng(lat, lng));
  map.setZoom(16);
}

//데이터 로드중 실행하는 함수입니다.
function onProgress() {

}

//데이터 로드 중 에러가 발생시 실행하는 함수입니다.
function onError() {
  alert("onError");
}