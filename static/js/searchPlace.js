// 2. POI 통합 검색 API 요청

const searchKeyword = document.querySelector('.searchKeyword');
const searchResult = document.querySelector('.searchResult');

searchKeyword.addEventListener('keyup', searchPlace);
document.addEventListener('click', hideSearchResult);

function searchPlace() {
  if (searchResult.style.display == 'none') {
    searchResult.style.display = 'block';
  }
  console.log('검색하는 중...');

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

      let resultpoisData = response.searchPoiInfo.pois.poi;

      let innerHtml = "";	// Search Reulsts 결과값 노출 위한 변수

      for (let k in resultpoisData) {

        let noorLat = Number(resultpoisData[k].noorLat);
        let noorLon = Number(resultpoisData[k].noorLon);
        let name = resultpoisData[k].name;

        let pointCng = new Tmapv2.Point(noorLon, noorLat);
        console.log(pointCng);
        let projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

        let lat = projectionCng._lat;
        let lon = projectionCng._lng;

        let markerPosition = new Tmapv2.LatLng(lat, lon);

        // marker = new Tmapv2.Marker({
        //   position: markerPosition,
        //   //icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
        //   icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
        //   iconSize: new Tmapv2.Size(24, 38),
        //   title: name,
        //   map: map
        // });

        innerHtml += "<li><span>" + name + "</span></li>";

      }

      searchResult.innerHTML = innerHtml;

    },
    error: function (request, status, error) {
      console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    }
  });
}

function hideSearchResult() {
  searchResult.style.display = "none";
}