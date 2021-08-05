const bottomSheet = document.querySelector('.bottom-sheet');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');

const reloadBtn = document.querySelector('.reload-btn');
const reloadBtnAddress = document.querySelector('.reload-btn .name .address');

const loca = document.querySelector('.bottom-sheet .info-summary .loca');
const evalAvgNum = document.querySelector(
  '.bottom-sheet .info-summary .eval-avg .num'
);
const managementInfo = document.querySelector(
  '.bottom-sheet .info-detail .management .management__detail'
);

function setBulbRate(bulb) {
  const lightbulb = document.querySelectorAll('.icons > .fa-lightbulb');
  let num = bulb.getAttribute('name');
  for (i = 0; i < num; i++) {
    lightbulb[i].classList.add('selected');
  }
  for (i = num; i < 5; i++) {
    lightbulb[i].classList.remove('selected');
  }
}

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
  s_mk_lat = lat;
  s_mk_lng = lng;
}

function passFn(lat, lng) {
  passList.push(lat)
  passList.push(lng)
  console.log(passList)
  if (passList.length == 11) {
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

function onClose(popup) {
  infoWindow.setVisible(false);
}

function changeInfo(address, resultData) {
  loca.innerText = `${address}`;
  managementInfo.innerText = `${resultData[0].institutionNm} / ${resultData[0].phoneNumber}`;
}

function callClick() {
  var num = document
    .querySelector('.management__detail')
    .textContent.split(' / ')[1];
  location.href = 'tel:' + num;
}

function markerEvent(address, resultData) {
  bottomSheet.classList.remove('init');
  report.classList.remove('init');

  if (bottomSheet.classList.contains('up')) {
    changeInfo(address, resultData);
  } else {
    changeInfo(address, resultData);
    bottomSheet.classList.remove('down');
    bottomSheet.classList.add('up');
    report.classList.remove('down');
    report.classList.add('up');
  }
}

function bottomSheetEvent() {
  bottomSheet.classList.remove('init');
  bottomSheet.classList.toggle('down');
  bottomSheet.classList.toggle('up');

  report.classList.remove('init');
  report.classList.toggle('down');
  report.classList.toggle('up');
}

infoSummary.addEventListener('click', () => {
  bottomSheetEvent();
});

let totalMarkerArr = [];
let drawInfoArr = [];
let resultdrawArr = [];

function initTmap() {
  map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
    width: '100%',
    height: '100%',
    zoom: 15,
    zIndexMarker: "8",
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  getAddress(center._lat, center._lng);
  loadGetLonLatFromAddress(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);
  map.addListener('contextmenu', onClick); //map 클릭 이벤트를 등록합니다.

  var markers = [];
  var markers2 = [];


  function setMarker(resultData) {
    var positions = [];

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

    for (var i = 0; i < positions.length; i++) {
      //for문을 통하여 배열 안에 있는 값을 마커 생성
      var lonlat = positions[i].lonlat;
      //Marker 객체 생성.
      marker = new Tmapv2.Marker({
        position: lonlat, //Marker의 중심좌표 설정.
        icon: '/static/img/lamp-icon.png', //Marker의 아이콘.
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

        let content ="<div class='info_container' style='position: static; display: flex; flex-direction: column; font-size: 18px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 170px; background: #FFFFFF 0% 0% no-repeat padding-box;'>"+
                     "<a class='btn-close' style='position: absolute; top: 5px; right: 5px; display: block; width: 15px; height: 15px; background: url(static/img/x.png) center;' href='javascript:void(0)' onclick='onClose()' ></a>"+
                     "<div class='info-box'>"+
                     "<p style='display: block;height: 20px;padding-right:20px;padding-top:5px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='startFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 출발지로 지정</a></p>"+
                     "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='passFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 경유지로 지정</a></p>"+
                     "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='destinationFn(" + marker._marker_data.options.position._lat + "," + marker._marker_data.options.position._lng + "); onClose();'>여기를 목적지로 지정</a></p>"+
                     "</div>"+
                     "<a href='javascript:void(0)' onclick='onClose()' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; background: url(resources/images/sample/btn-close-w.svg) no-repeat center;'></a>"+
                     "</div>"+
                     "</div>";
        
          
        //JS에서 받아온거가 html에서 못알아먹을수도 있다! 긍까 반드시 개발자모드로 가서 element에서 html에서 잘 인식하는지 확인을 하고 아니다 하면 저기 "+ㅇㅇ+"처럼하기       
        //Popup 객체 생성.

        infoWindow = new Tmapv2.InfoWindow({
          position: new Tmapv2.LatLng(marker._marker_data.options.position._lat, marker._marker_data.options.position._lng), //Popup 이 표출될 맵 좌표
          content: content, //Popup 표시될 text
          type: 2, //Popup의 type 설정.
          border :'0px solid #FF0000',
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

  reloadBtn.addEventListener('click', () => {
    let center = map.getCenter();
    loadGetLonLatFromAddress(center._lat, center._lng);
  });

  function onDragend(e) {
    getAddress(e.latLng._lat, e.latLng._lng);
  }

  function onTouchend(e) {
    getAddress(e.latLng._lat, e.latLng._lng);
  }

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

  function adminCodeToViews(code) {
    $.ajax({
      type: 'POST',
      url: '',
      data: { code: code },
      success: function (response) {
        if (response.length == 2) {
          alert('해당 지역에는 보안등 데이터가 존재하지 않아요😥');
        } else {
          let data = response.replaceAll(`'`, `"`);
          let placeData = JSON.parse(data);
          setMarker(placeData);
        }
      },
      error: function () {
        console.log('실패-!');
        alert('해당 지역에는 보안등 데이터가 존재하지 않아요😥');
      },
    });
  }

  //리버스 지오코딩 요청 함수
  function loadGetLonLatFromAddress(lat, lng) {
    // TData 객체 생성
    var tData = new Tmapv2.extension.TData();

    var optionObj = {
      coordType: 'WGS84GEO', //응답좌표 타입 옵션 설정 입니다.
      addressType: 'A04', //주소타입 옵션 설정 입니다.
    };

    var params = {
      onComplete: onComplete, //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
      onProgress: onProgress, //데이터 로드 중에 실행하는 함수 입니다.
      onError: onError, //데이터 로드가 실패했을때 실행하는 함수 입니다.
    };
    // TData 객체의 리버스지오코딩 함수
    tData.getAddressFromGeoJson(lat, lng, optionObj, params);
  }

  //리버스 지오코딩
  function onComplete() {
    let city_do = this._responseData.addressInfo.city_do;
    let gu_gun = this._responseData.addressInfo.gu_gun;
    let roadName = this._responseData.addressInfo.roadName;
    let address = city_do + ' ' + gu_gun;
    let address2 = address + ' ' + roadName;
    // console.log(this._responseData);


    let jibunAdd = getAddrLoc(address2);

    // let address_code;


    // 주소 -> 제공기관 코드
    // let adminCode = JSON.parse(data);
    // for (i = 0; i < adminCode.length; i++) {
    //   if (adminCode[i]['제공기관명'] == address) {
    //     address_code = adminCode[i]['제공기관코드'];
    //     break;
    //   }
    // }

    adminCodeToViews(address + ' ' + jibunAdd);
  }

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {
    //alert("onComplete");
  }

  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert('onError');
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

  // gps가져오는 부분

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position.coords.latitude + ', ' + position.coords.longitude);

    var gpslat = position.coords.latitude;
    var gpslng = position.coords.longitude;
    marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(gpslat, gpslng), //Marker의 중심좌표 설정.
      icon: '/static/img/GPS-sm.png',

      map: map, //Marker가 표시될 Map 설정.

    });
    markers2.push(marker);
  });

}
function tonowposition() {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lonlat = new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(lonlat); // 지도의 중심 좌표를 설정합니다.
  });
}

// 리버스 지오코딩 (reload 버튼 주소)
function getAddress(lat, lng) {
  let tData = new Tmapv2.extension.TData();

  let optionObj = {
    coordType: 'WGS84GEO', //응답좌표 타입 옵션 설정 입니다.
    addressType: 'A04', //주소타입 옵션 설정 입니다.
  };

  let params = {
    onComplete: fun1, //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
    onProgress: fun2, //데이터 로드 중에 실행하는 함수 입니다.
    onError: fun3, //데이터 로드가 실패했을때 실행하는 함수 입니다.
  };
  // TData 객체의 리버스지오코딩 함수
  tData.getAddressFromGeoJson(lat, lng, optionObj, params);
}

function fun1() {
  let city_do = this._responseData.addressInfo.city_do;
  let gu_gun = this._responseData.addressInfo.gu_gun;
  let address = city_do + ' ' + gu_gun;
  let roadName = this._responseData.addressInfo.roadName;
  let address2 = address + ' ' + roadName;

  let jibunAdd = getAddrLoc(address2);

  reloadBtnAddress.innerText = `${address} ${jibunAdd}`;
}
function fun2() { }
function fun3() { }

