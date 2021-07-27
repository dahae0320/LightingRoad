// 2. POI 통합 검색 API 요청
// $("#btn_select").click(function () {
function searchPlace() {

  let searchKeyword = document.querySelector('.searchKeyword');
  let searchResult = document.querySelector('.searchResult');
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
      var resultpoisData = response.searchPoiInfo.pois.poi;

      // 기존 마커, 팝업 제거
      // if (markerArr.length > 0) {
      //   for (var i in markerArr) {
      //     markerArr[i].setMap(null);
      //   }
      // }
      var innerHtml = "";	// Search Reulsts 결과값 노출 위한 변수
      // var positionBounds = new Tmapv2.LatLngBounds();		//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성

      for (var k in resultpoisData) {

        var noorLat = Number(resultpoisData[k].noorLat);
        var noorLon = Number(resultpoisData[k].noorLon);
        var name = resultpoisData[k].name;

        var pointCng = new Tmapv2.Point(noorLon, noorLat);
        var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

        var lat = projectionCng._lat;
        var lon = projectionCng._lng;

        var markerPosition = new Tmapv2.LatLng(lat, lon);

        // marker = new Tmapv2.Marker({
        //   position: markerPosition,
        //   //icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
        //   icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
        //   iconSize: new Tmapv2.Size(24, 38),
        //   title: name,
        //   map: map
        // });

        innerHtml += "<li><span>" + name + "</span></li>";

        // markerArr.push(marker);
        // positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
      }

      // $("#searchResult").html(innerHtml);	//searchResult 결과값 노출
      searchResult.innerHTML = innerHtml;
      // map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
      // map.zoomOut();

    },
    error: function (request, status, error) {
      console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    }
  });
}