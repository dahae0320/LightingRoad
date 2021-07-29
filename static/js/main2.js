var markers2 = [];
var marker;
var lonlat;
var map;

const bottomSheet = document.querySelector('.bottom-sheet');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');

//추가 
const loca = document.querySelector('.bottom-sheet .info-summary .loca');
const evalAvgNum = document.querySelector(
  '.bottom-sheet .info-summary .eval-avg .num'
);
const managementInfo = document.querySelector(
  '.bottom-sheet .info-detail .management .management__detail'
);

function changeInfo(address, resultData) {
  loca.innerText = `${address}`;
  managementInfo.innerText = `${resultData[0].institutionNm} / ${resultData[0].phoneNumber}`;
}
//
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

var s_mk_lat;
var s_mk_lng;
var p_mk_lat;
var p_mk_lng;
var d_mk_lat;
var d_mk_lng;
var p_mk_list = [];

function startFn(lat,lng) {
	console.log('여기를 출발지로 지정 클릭수행')
  console.log(lat, lng)
  s_mk_lat = lat;
  s_mk_lng = lng;
}


let passListData;
function passFn(lat,lng) {
	console.log('여기를 경유지로 지정 클릭수행')
  console.log(lat, lng)
  p_mk_lat = lat;
  p_mk_lng = lng;
  // p_mk_list.push(p_mk_lng);
  // p_mk_list.push(p_mk_lat);
  // console.log(p_mk_list);
}

function destinationFn(lat,lng) {
	console.log('여기를 목적지로 지정 클릭수행')
  console.log(lat, lng)
  d_mk_lat = lat;
  d_mk_lng = lng;
}


infoSummary.addEventListener('click', () => {
  bottomSheetEvent();
});


var marker_s, marker_e, marker_p1, marker_p2;
var marker_2,marker_3, marker_4;  // 경유지 변수 추가
var totalMarkerArr = [];
var drawInfoArr = [];
var resultdrawArr = [];
var marker1_lat, marker1_lng, marker2_lat, marker2_lng;

function initTmap() {
  let map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(37.570028, 126.989072), // 지도 초기 좌표
    width: '100%',
    height: '500px',
    zoom: 15,
    zIndexMarker: "8",
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  loadGetLonLatFromAddress(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);
  map.addListener('contextmenu', onClick); //map 클릭 이벤트를 등록합니다.
  
  var markers = [];

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
        icon: '/static/img/lamp-icon-sm.png', //Marker의 아이콘.
        map: map, //Marker가 표시될 Map 설정.
      title: resultData[i].rdnmadr,
      zIndexMarker: 10,
      });
     if (marker.title == undefined) {
        marker.setTitle(resultData[i].lnmadr);
     }
      markers.push(marker);
    }
    //Marker에 클릭이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('click', (evt) => {
      console.log('제발',marker._marker_data.options.position._lat, marker._marker_data.options.position._lng)
      // console.log(marker._marker_data.options.position._lng)
      // marker1_lat = marker._marker_data.options.position._lat
      // marker1_lng = marker._marker_data.options.position._lng
        markerEvent(marker._marker_data.options.title, resultData);
  
        var content =
			"<div class='outside' style=' position: relative;  width:130px; border-bottom: 1px solid black; line-height: 18px; padding: 0 35px 2px 0;'>" +
           "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
           "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='startFn("+marker._marker_data.options.position._lat+","+marker._marker_data.options.position._lng+"); markerChange("+marker._marker_data.options.position._lat+","+marker._marker_data.options.position._lng+") '>여기를 출발지로 지정</a></span>" +
           "</div>" +
           "</div>" +
		   "<div class='outside' style=' position: relative;  width:130px; border-bottom: 1px solid black; line-height: 18px; padding: 0 35px 2px 0;'>" +
           "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
           "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='passFn("+marker._marker_data.options.position._lat+","+marker._marker_data.options.position._lng+");'>여기를 경유지로 지정</a></span>" +
           "</div>" +
           "</div>" +
		   "<div class='outside' style=' position: relative;  width:130px; line-height: 18px; padding: 0 35px 2px 0;'>" +
           "<div class='a' width:130px; style='font-size: 12px; line-height: 15px;'>" +
           "<span class='b' style='display: inline-block; width:130px; height: 14px; margin-left:2px; vertical-align: middle; margin-right: 5px;'><a href='javascript:void(0);' onclick='destinationFn("+marker._marker_data.options.position._lat+","+marker._marker_data.options.position._lng+");'>여기를 목적지로 지정</a></span>" +
           "</div>" +
           "</div>" +
    


          //JS에서 받아온거가 html에서 못알아먹을수도 있다! 긍까 반드시 개발자모드로 가서 element에서 html에서 잘 인식하는지 확인을 하고 아니다 하면 저기 "+ㅇㅇ+"처럼하기        

        //    "<div class='c' style='position: relative; z-index:100000; padding-top: 5px; display:inline-block'>" +
        //    "<div class='d' style='display:inline-block; vertical-align: top;'>" +
        //    "<span class='e' style='font-size: 12px; margin-left:2px; margin-bottom:2px; display:block;'>여기를 경유지로 지정</span>" +
        //    "<span class='f' style='font-size: 12px; margin-left:2px; margin-bottom:2px; display:block;'>여기를 목적지로 지정</span>" +
        //    "<span class='g' style='font-size: 12px; margin-left:2px;'><a href='https://openapi.sk.com/' target='blank'>개발자센터</a></span>" +
           "</div>" +
               "</div>";
      //Popup 객체 생성.
      infoWindow = new Tmapv2.InfoWindow({
         position: new Tmapv2.LatLng(marker._marker_data.options.position._lat,marker._marker_data.options.position._lng), //Popup 이 표출될 맵 좌표
         content: content, //Popup 표시될 text
         type: 2, //Popup의 type 설정.
         map: map, //Popup이 표시될 맵 객체
         setVisible: true
      });

      // function onClose(popup){
      //    infoWindow.setVisible(false);
      // }
      
      })
    );

    // Marker에 터치이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('touchstart', (evt) => {
        markerEvent(marker._marker_data.options.title, resultData);
      })
    );
  }


  function onDragend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function onTouchend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function onClick(e) {
   // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
   removeMarkers();

   
   lonlat = e.latLng;
   //Marker 객체 생성.
   marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
      map: map //Marker가 표시될 Map 설정.
   });
     
      markers2.push(marker);


   }

   function removeMarkers() {
      for (var i = 0; i < markers2.length; i++) {
         markers2[i].setMap(null);
      }
      markers2 = [];
   }


  function adminCodeToViews(code) {
    $.ajax({
      type: 'POST',
      url: '/main2/',
      data: { code: code },
      success: function (response) {
        let data = response.replaceAll(`&quot;`, `"`);
        let placeData = JSON.parse(data);
        console.log(placeData);
        let resultData = placeData['response']['body']['items'];
        setMarker(resultData);
      },
    //   error: function () {
    //     console.log('실패-!');
      error:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

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
    console.log(this._responseData); //json으로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.
    let city_do = this._responseData.addressInfo.city_do;
    let gu_gun = this._responseData.addressInfo.gu_gun;
    let address = city_do + ' ' + gu_gun;

    let address_code;

    // 주소 -> 제공기관 코드
    let adminCode = JSON.parse(data);
    for (i = 0; i < adminCode.length; i++) {
      if (adminCode[i]['제공기관명'] == address) {
        address_code = adminCode[i]['제공기관코드'];
        break;
      }
    }

    adminCodeToViews(address_code);
  }

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {
    //alert("onComplete");
  }

  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert('onError');
  }

  // var mm

  // function markerChange(lat, lng) {
  //   mm = new Tmapv2.Marker(
  //     {
  //        position : new Tmapv2.LatLng(lat, lng),
  //        icon : "https://img.icons8.com/fluent/96/000000/marker-b.png",
  //        iconSize : new Tmapv2.Size(24, 38),
  //        map : map
  //     });
  // }

  // 2. 시작, 도착 심볼찍기
   // 시작
   marker_s = new Tmapv2.Marker(
      {
         position : new Tmapv2.LatLng(37.56689860, 126.97871544),
         icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
         iconSize : new Tmapv2.Size(24, 38),
         map : map
      });
   // 3번째 경유지  GS25
   marker_2 = new Tmapv2.Marker(
      {
         position : new Tmapv2.LatLng(37.56772766459168, 126.99755684423954),
         icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
         iconSize : new Tmapv2.Size(24, 38),
         map : map
      });
   // 2번째 경유지
   marker_3 = new Tmapv2.Marker(
      {
         position : new Tmapv2.LatLng(37.5672089168727, 126.99050799891104),
         icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
         iconSize : new Tmapv2.Size(24, 38),
         map : map
      });
   
   // 도착
   marker_e = new Tmapv2.Marker(
         {
            position : new Tmapv2.LatLng(37.57081522, 127.00160213),
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
            iconSize : new Tmapv2.Size(24, 38),
            map : map
         });
      
   var p1 = [126.99050799891104, 37.5672089168727]
   var p2 = [126.99755684423954, 37.56772766459168]  
  
  //  var ppp = [p_mk_lng, p_mk_lat]
  //  passListData = `${p_mk_lng},${p_mk_lat}_`
  var a = String(p_mk_lng);
  var b = String(p_mk_lat);
  passListData = `sdfg${a},${b}`
      
     
   // 3. 경로탐색 API 사용요청
      ////추가
   $("#btn_select")
      .click(
            function() {
               //기존 맵에 있던 정보들 초기화
               // resettingMap();
               var searchOption = $("#selectLevel").val();
               var trafficInfochk = $("#year").val();
               //JSON TYPE EDIT [S]
               $
                     .ajax({
                        method : "POST",
                        url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
                        async : false,
                        data : {
                           "appKey" : "l7xx277bb41e41d345caae019ce5a6c7b6cb",
                          //  "startX" : "126.97871544",
                          //  "startY" : "37.56689860",
                          "startX" : s_mk_lng,
                          "startY" : s_mk_lat,
                           "endX" : d_mk_lng,
                           "endY" : d_mk_lat,
                           "passList" : `${p_mk_lng},${p_mk_lat}_`,
                           // "passList" : "126.99050799891104,37.5672089168727_126.99755684423954,37.56772766459168_",   //출발지에 가까운게 제일 처음
                           "reqCoordType" : "WGS84GEO",
                           "resCoordType" : "EPSG3857",
                           "startName" : "출발지",
                           "endName" : "도착지"
                        },
                        success : function(response) {
                           var resultData = response.features;
                           //결과 출력
                           var tDistance = "총 거리 : "
                                 + ((resultData[0].properties.totalDistance) / 1000)
                                       .toFixed(1) + "km,";
                           var tTime = " 총 시간 : "
                                 + ((resultData[0].properties.totalTime) / 60)
                                       .toFixed(0) + "분";
                           $("#result").text(tDistance + tTime);

                           //기존 그려진 라인 & 마커가 있다면 초기화
                           if (resultdrawArr.length > 0) {
                              for ( var i in resultdrawArr) {
                                 resultdrawArr[i]
                                       .setMap(null);
                              }
                              resultdrawArr = [];
                           }

                           drawInfoArr = [];
                           for ( var i in resultData) { //for문 [S]
                              var geometry = resultData[i].geometry;
                              var properties = resultData[i].properties;
                              var polyline_;
                              if (geometry.type == "LineString") {
                                 for ( var j in geometry.coordinates) {
                                    // 경로들의 결과값(구간)들을 포인트 객체로 변환 
                                    var latlng = new Tmapv2.Point(
                                          geometry.coordinates[j][0],
                                          geometry.coordinates[j][1],
                                          geometry.coordinates[j][2],
                                          );
                                    // 포인트 객체를 받아 좌표값으로 변환
                                    var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                          latlng);
                                    // 포인트객체의 정보로 좌표값 변환 객체로 저장
                                    var convertChange = new Tmapv2.LatLng(
                                          convertPoint._lat,
                                          convertPoint._lng);
                                    // 배열에 담기
                                    drawInfoArr.push(convertChange);
                                 }
                              } else {
                                 var markerImg = "";
                                 var pType = "";
                                 var size;
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
                                 var latlon = new Tmapv2.Point(
                                       geometry.coordinates[0],
                                       geometry.coordinates[1],
                                       geometry.coordinates[2],
                                       );
                                 // 포인트 객체를 받아 좌표값으로 다시 변환
                                 var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                       latlon);
                                 var routeInfoObj = {
                                    markerImage : markerImg,
                                    lng : convertPoint._lng,
                                    lat : convertPoint._lat,
                                    pointType : pType
                                 };
                                 // Marker 추가
                                 marker_p = new Tmapv2.Marker(
                                       {
                                          position : new Tmapv2.LatLng(
                                                routeInfoObj.lat,
                                                routeInfoObj.lng),
                                          icon : routeInfoObj.markerImage,
                                          iconSize : size,
                                          map : map
                                       });
                              }
                           }//for문 [E]
                           drawLine(drawInfoArr);
                        },
                        error : function(request, status, error) {
                           console.log("code:" + request.status + "\n"
                                 + "message:" + request.responseText + "\n"
                                 + "error:" + error);
                        }
                     });
      });

         function drawLine(arrPoint) {
            var polyline_;
         
            polyline_ = new Tmapv2.Polyline({
               path : arrPoint,
               strokeColor : "#DD0000",
               strokeWeight : 6,
               map : map
            });
            resultdrawArr.push(polyline_);
         }

         
         
}

