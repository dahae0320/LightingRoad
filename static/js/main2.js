
let markers2 = [];
let marker;
let lonlat;
let map;

let s_mk_lat;
let s_mk_lng;
let d_mk_lat;
let d_mk_lng;
let Pass;
let passList = []

function startFn(lat, lng) {
  marker_s = new Tmapv2.Marker(
    {
      position : new Tmapv2.LatLng(lat, lng),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
      iconSize : new Tmapv2.Size(24, 38),
      map : map
    });
  s_mk_lat = lat;
  s_mk_lng = lng;
  Pass = '';
  
}

function passFn(lat, lng) {
  passList.push(lat)
  passList.push(lng)
  console.log(passList)
  if (passList.length == 10) {
    Pass = ''
    passList = []
  } else {
    for (let i = 0; i < 1; i++) {
      if (Pass == undefined) {
        Pass = `${lng},${lat}_`
      } else {
        Pass = Pass + `${lng},${lat}_`
      }
    }
  }
}


function destinationFn(lat, lng) {

  d_mk_lat = lat;
  d_mk_lng = lng;
}


// infoSummary.addEventListener('click', () => {
//   bottomSheetEvent();
// });

function onClose(popup) {
  infoWindow.setVisible(false);
}

let marker_s, marker_e, marker_p1, marker_p2;
let totalMarkerArr = [];
let drawInfoArr = [];
let resultdrawArr = [];
let marker1_lat, marker1_lng, marker2_lat, marker2_lng;

function initTmap() {
  let map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(37.570028, 126.989072), // 지도 초기 좌표
    width: '100%',
    height: '700px',
    zoom: 15,
    zIndexMarker: "8", 

  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  // let center = map.getCenter();
  // loadGetLonLatFromAddress(center._lat, center._lng);

  // map.addListener('dragend', onDragend);
  // map.addListener('touchend', onTouchend);
  map.addListener('contextmenu', onClick); //map 클릭 이벤트를 등록합니다.

  let markers = [];

  function setMarker(resultData) {
    let positions = [];

    // 기존 marker 제거
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    for (let i = 0; i < resultData.length; i++) {
      positions.push({
        lonlat: new Tmapv2.LatLng(
          resultData[i].latitude,
          resultData[i].longitude
        ),
      });
    }

    for (let i = 0; i < positions.length; i++) {
      //for문을 통하여 배열 안에 있는 값을 마커 생성
      let lonlat = positions[i].lonlat;
      //Marker 객체 생성.
      marker = new Tmapv2.Marker({
        position: lonlat, //Marker의 중심좌표 설정.
        icon: '/static/img/lamp-icon-sm.png', //Marker의 아이콘.
        map: map, //Marker가 표시될 Map 설정.
        title: resultData[i].rdnmadr,
      });
      if (marker.title == undefined) {
        marker.setTitle(resultData[i].lnmadr);
      }
      markers.push(marker);
    }

    //Marker에 클릭이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('click', (evt) => {
        markerEvent(marker._marker_data.options.title, resultData);

        let content =
          "<div class='outside' style=' position: relative;  width:150px; border-bottom: 1px solid black; line-height: 18px; padding: 0 35px 2px 0;'>" +
          "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
          "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='startFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 출발지로 지정</a></span>" +
          "</div>" +
          "</div>" +
          "<div class='outside' style=' position: relative;  width:150px; border-bottom: 1px solid black; line-height: 18px; padding: 0 35px 2px 0;'>" +
          "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
          "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='passFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 경유지로 지정</a></span>" +
          "</div>" +
          "</div>" +
          "<div class='outside' style=' position: relative;  width:150px; line-height: 18px; padding: 0 35px 2px 0;'>" +
          "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
          "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='destinationFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 목적지로 지정</a></span>" +
          "</div>" +
          "</div>" +

          //JS에서 받아온거가 html에서 못알아먹을수도 있다! 긍까 반드시 개발자모드로 가서 element에서 html에서 잘 인식하는지 확인을 하고 아니다 하면 저기 "+ㅇㅇ+"처럼하기        
          "</div>" +
          "</div>";
        //Popup 객체 생성.

        infoWindow = new Tmapv2.InfoWindow({
          position: new Tmapv2.LatLng(marker._marker_data.options.position._lat, marker._marker_data.options.position._lng), //Popup 이 표출될 맵 좌표
          content: content, //Popup 표시될 text
          type: 2, //Popup의 type 설정.
          map: map, //Popup이 표시될 맵 객체
          setVisible: true
        });

      })
    );

    // Marker에 터치이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('touchstart', (evt) => {
        markerEvent(marker._marker_data.options.title, resultData);
      })
    );
  }


  // function onDragend(e) {
  //   loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  // }

  // function onTouchend(e) {
  //   loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  // }

  function onClick(e) {
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();

    lonlat = e.latLng;
    //Marker 객체 생성.
    marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lonlat.lat(), lonlat.lng()), //Marker의 중심좌표 설정.
      map: map //Marker가 표시될 Map 설정.
    });

    markers2.push(marker);

  }

  function removeMarkers() {
    for (let i = 0; i < markers2.length; i++) {
      markers2[i].setMap(null);
    }
    markers2 = [];
  }

  //  경로탐색 API 사용요청
  ////추가
  $("#btn_select")
    .click(
      function () {
        //기존 맵에 있던 정보들 초기화
        // resettingMap();
        let searchOption = $("#selectLevel").val();
        let trafficInfochk = $("#year").val();
        //JSON TYPE EDIT [S]
        $
          .ajax({
            method: "POST",
            url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
            async: false,
            data: {
              "appKey": "l7xx277bb41e41d345caae019ce5a6c7b6cb",
              //  "startX" : "126.97871544",
              //  "startY" : "37.56689860",
              "startX": s_mk_lng,
              "startY": s_mk_lat,
              "endX": d_mk_lng,
              "endY": d_mk_lat,
              //  "passList" : `${p_mk_lng},${p_mk_lat}_`,
              "passList": Pass,
              "reqCoordType": "WGS84GEO",
              "resCoordType": "EPSG3857",
              "startName": "출발지",
              "endName": "도착지"
            },
            success: function (response) {
              let resultData = response.features;
              //결과 출력
              let tDistance = "총 거리 : "
                + ((resultData[0].properties.totalDistance) / 1000)
                  .toFixed(1) + "km,";
              let tTime = " 총 시간 : "
                + ((resultData[0].properties.totalTime) / 60)
                  .toFixed(0) + "분";
              $("#result").text(tDistance + tTime);

              //기존 그려진 라인 & 마커가 있다면 초기화
              if (resultdrawArr.length > 0) {
                for (let i in resultdrawArr) {
                  resultdrawArr[i]
                    .setMap(null);
                }
                resultdrawArr = [];
              }

              drawInfoArr = [];
              for (let i in resultData) { //for문 [S]
                let geometry = resultData[i].geometry;
                let properties = resultData[i].properties;
                let polyline_;
                if (geometry.type == "LineString") {
                  for (let j in geometry.coordinates) {
                    // 경로들의 결과값(구간)들을 포인트 객체로 변환 
                    let latlng = new Tmapv2.Point(
                      geometry.coordinates[j][0],
                      geometry.coordinates[j][1],
                      geometry.coordinates[j][2],
                    );
                    // 포인트 객체를 받아 좌표값으로 변환
                    let convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                      latlng);
                    // 포인트객체의 정보로 좌표값 변환 객체로 저장
                    let convertChange = new Tmapv2.LatLng(
                      convertPoint._lat,
                      convertPoint._lng);
                    // 배열에 담기
                    drawInfoArr.push(convertChange);
                  }
                } else {
                  let markerImg = "";
                  let pType = "";
                  let size;
                  if (properties.pointType == "S") { //출발지 마커
                    markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
                    pType = "S";
                    size = new Tmapv2.Size(24, 38);
                  } else if (properties.pointType == "E") { //도착지 마커
                    markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
                    pType = "E";
                    size = new Tmapv2.Size(24, 38);
                  } else { //각 포인트 마커
                    markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                    pType = "P";
                    size = new Tmapv2.Size(8, 8);
                  }
                  // 경로들의 결과값들을 포인트 객체로 변환 
                  let latlon = new Tmapv2.Point(
                    geometry.coordinates[0],
                    geometry.coordinates[1],
                    geometry.coordinates[2],
                  );
                  // 포인트 객체를 받아 좌표값으로 다시 변환
                  let convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                    latlon);
                  let routeInfoObj = {
                    markerImage: markerImg,
                    lng: convertPoint._lng,
                    lat: convertPoint._lat,
                    pointType: pType
                  };
                  // Marker 추가
                  marker_p = new Tmapv2.Marker(
                    {
                      position: new Tmapv2.LatLng(
                        routeInfoObj.lat,
                        routeInfoObj.lng),
                      icon: routeInfoObj.markerImage,
                      iconSize: size,
                      map: map
                    });
                }
              }//for문 [E]
              drawLine(drawInfoArr);
            },
            error: function (request, status, error) {
              console.log("code:" + request.status + "\n"
                + "message:" + request.responseText + "\n"
                + "error:" + error);
            }
          });
      });

  function drawLine(arrPoint) {
    let polyline_;

    polyline_ = new Tmapv2.Polyline({
      path: arrPoint,
      strokeColor: "#DD0000",
      strokeWeight: 6,
      map: map
    });
    resultdrawArr.push(polyline_);
  }


}

