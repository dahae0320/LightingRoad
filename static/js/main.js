const bottomSheet = document.querySelector('.bottom-sheet');
const searchBox = document.querySelector('.search-box');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');
const bottomSheetBar = document.querySelector(
  '.bottom-sheet .info-summary .info-detail'
);

const reloadBtn = document.querySelector('.reload-btn');
const reloadBtnAddress = document.querySelector('.reload-btn .name .address');

const loca = document.querySelector('.bottom-sheet .info-summary .loca');
const evalAvgNum = document.querySelector(
  '.bottom-sheet .info-summary .eval-avg .num'
);
const managementInfo = document.querySelector(
  '.bottom-sheet .info-detail .management .management__detail'
);
const btndeleteContainer = document.querySelector('.delete_container');

let roadcount = 0; //길찾기 on/off 전환..

const lightbulb = document.querySelectorAll('.icons > .fa-lightbulb');

const bulb1 = document.querySelector(
  '.bottom-sheet .info-detail .eval .icons .bulb1'
);
const bulb2 = document.querySelector(
  '.bottom-sheet .info-detail .eval .icons .bulb2'
);
const bulb3 = document.querySelector(
  '.bottom-sheet .info-detail .eval .icons .bulb3'
);
const bulb4 = document.querySelector(
  '.bottom-sheet .info-detail .eval .icons .bulb4'
);
const bulb5 = document.querySelector(
  '.bottom-sheet .info-detail .eval .icons .bulb5'
);

const bulbArr = [bulb1, bulb2, bulb3, bulb4, bulb5];

const sideBtns = document.querySelector('.side-btns');
const naviModeBtn = document.querySelector('.side-btns .navi-mode-btn');
const naviStartBtn = document.querySelector('.side-btns .navi-start-btn');
const naviExitBtn = document.querySelector('.side-btns .navi-exit-btn');

function setBulbRate(bulb, id, avgSum, avgCount) {
  let num = parseInt(bulb.getAttribute('name'));

  avgSum += num;
  avgCount++;

  for (i = 0; i < num; i++) {
    lightbulb[i].classList.add('selected');
  }

  for (i = num; i < 5; i++) {
    lightbulb[i].classList.remove('selected');
  }

  $.ajax({
    type: 'POST',
    url: 'avg/',
    data: { id: id, avgSum: avgSum, avgCount: avgCount },
    success: function (response) {
      console.log('성공');
    },
    error: function () {
      console.log('실패!');
    },
  });
}

let markers2 = [];
let marker;
let lonlat;
let map;

let s_mk_lat, s_mk_lng;
let d_mk_lat, d_mk_lng;
let Pass;
let passList = [];
let marker_pass1, marker_pass2, marker_pass3, marker_pass4, marker_pass5;

let totalMarkerArr = [];
let drawInfoArr = [];
let resultdrawArr = [];
let resultMarkerArr = [];
let chktraffic = [];
let removecount = 0;

let infoWindows1 = [];
let infoWindows2 = [];
let infoWindow;

let startArr = [];
let passArr = [];
let destinationArr = [];

function startFn(lat, lng) {
  s_mk_lat = lat;
  s_mk_lng = lng;

  if (startArr.length > 0) {
    for (var i in startArr) {
      startArr[i].setMap(null);
    }
    startArr = [];
  }

  marker_s = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(lat, lng),
    icon: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png',
    iconSize: new Tmapv2.Size(40, 45),
    map: map,
  }); //출발 마커 생성
  startArr.push(marker_s);
}

function passFn(lat, lng) {
  passList.push(lat);
  passList.push(lng);

  if (passList.length > 12) {
    Pass = '';
    passList = [];
  } else {
    for (let i = 0; i < 1; i++) {
      if (Pass == undefined) {
        Pass = `${lng},${lat}_`;
      } else {
        Pass = Pass + `${lng},${lat}_`;
      }
    }
  }
  if (passList.length == 2) {
    marker_pass1 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lng),
      icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_1.png',
      iconSize: new Tmapv2.Size(24, 38),
      map: map,
    }); //경유지 마커 생성
    passArr.push(marker_pass1);
  } else if (passList.length == 4) {
    marker_pass2 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lng),
      icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_2.png',
      iconSize: new Tmapv2.Size(24, 38),
      map: map,
    }); //경유지 마커 생성
    passArr.push(marker_pass2);
  } else if (passList.length == 6) {
    marker_pass3 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lng),
      icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_3.png',
      iconSize: new Tmapv2.Size(24, 38),
      map: map,
    }); //경유지 마커 생성
    passArr.push(marker_pass3);
  } else if (passList.length == 8) {
    marker_pass4 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lng),
      icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_4.png',
      iconSize: new Tmapv2.Size(24, 38),
      map: map,
    }); //경유지 마커 생성
    passArr.push(marker_pass4);
  } else if (passList.length == 10) {
    marker_pass5 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lng),
      icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_5.png',
      iconSize: new Tmapv2.Size(24, 38),
      map: map,
    }); //경유지 마커 생성
    passArr.push(marker_pass5);

    alert('마지막 경유지 선택입니다.(5곳만 경유 가능합니다.)');
  } else {
    alert('❌길찾기 종료 후 다시 경로를 입력바랍니다.❌');
  }
}

function destinationFn(lat, lng) {
  d_mk_lat = lat;
  d_mk_lng = lng;

  if (destinationArr.length > 0) {
    for (var i in destinationArr) {
      destinationArr[i].setMap(null);
    }
    destinationArr = [];
  }

  marker_d = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(lat, lng),
    icon: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png',
    iconSize: new Tmapv2.Size(40, 45),
    map: map,
  }); //도착 마커 생성.
  destinationArr.push(marker_d);
}

//작은 동그라미 제거해야됨
function optiondelete() {
  roadcount = 0;
  removeMarkers();

  // if(removecount == 1){
  //   infoWindows1[count].setVisible(false);
  // }
  // else{
  //   infoWindows2[count].setVisible(false);
  // }

  if (passList.length > 0) {
    passList = [];
  }

  if (startArr.length > 0) {
    for (var i in startArr) {
      startArr[i].setMap(null);
    }
    startArr = [];
  }

  if (destinationArr.length > 0) {
    for (var i in destinationArr) {
      destinationArr[i].setMap(null);
    }
    destinationArr = [];
  }

  if (passArr.length > 0) {
    for (var i in passArr) {
      passArr[i].setMap(null);
    }
    passrArr = [];
  }

  if (resultdrawArr.length > 0) {
    for (var i = 0; i < resultdrawArr.length; i++) {
      resultdrawArr[i].setMap(null);
    }
    removeMarkers();
    resultdrawArr = [];
    markers2 = [];
  }

  s_mk_lat = '';
  s_mk_lng = '';
  d_mk_lat = '';
  d_mk_lng = '';
  Pass = '';

  console.log(
    `s_y:${s_mk_lat}, s_x:${s_mk_lng}, d_y:${d_mk_lat}, d_x:${d_mk_lng} ,Pass:${Pass}, passList:${passList}`
  );

  // resettingMap();
  bottomSheet.style.display = 'flex';
  searchBox.style.display = 'flex';
  reloadBtn.style.display = 'flex';
  btndeleteContainer.style.display = 'none';

  sideBtns.style.top = '100px';
  naviModeBtn.style.display = 'block';
  naviStartBtn.style.display = 'none';
  naviExitBtn.style.display = 'none';
}

function naviStart() {
  roadcount = 1;
  map.addListener('contextmenu', onClick);
  bottomSheet.style.display = 'none';
  searchBox.style.display = 'none';
  reloadBtn.style.display = 'none';

  sideBtns.style.top = '30px';
  btndeleteContainer.style.display = 'block';
  naviModeBtn.style.display = 'none';
  naviStartBtn.style.display = 'block';
  naviExitBtn.style.display = 'block';
}

function onClick(e) {
  if (roadcount != 0) {
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();

    lonlat = e.latLng;

    var count = 0;
    for (var i = 0; i < 1; i++) {
      for (var j = 0; j < 1; j++) {
        marker = new Tmapv2.Marker({
          position: new Tmapv2.LatLng(lonlat.lat(), lonlat.lng()), //Marker의 중심좌표 설정.
          map: map, //Marker가 표시될 Map 설정.
        });
        infoWindows1.push(infoWindow);
        if (infoWindows1[count] != null) {
          infoWindows1[count].setVisible(false);
        }
        if (roadcount != 0) {
          let content =
            "<div class='info_container' style='position: static; display: flex; flex-direction: column; font-size: 18px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 170px; background: #FFFFFF 0% 0% no-repeat padding-box;'>" +
            "<a class='btn-close' style='position: absolute; top: 5px; right: 5px; display: block; width: 15px; height: 15px; background: url(static/img/x.png) center;' href='javascript:void(0)' onclick='onClose(" +
            count +
            ")' ></a>" +
            "<div class='info-box'>" +
            "<p style='display: block;height: 20px;padding-right:20px;padding-top:5px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='startFn(" +
            lonlat.lat() +
            ',' +
            lonlat.lng() +
            '); onClose(' +
            count +
            ");'>여기를 출발지로 지정</a></p>" +
            "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='destinationFn(" +
            lonlat.lat() +
            ',' +
            lonlat.lng() +
            '); onClose(' +
            count +
            ");'>여기를 목적지로 지정</a></p>" +
            '</div>' +
            "<a href='javascript:void(0)' onclick='onClose(" +
            count +
            ")' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; background: url(resources/images/sample/btn-close-w.svg) no-repeat center;'></a>" +
            '</div>' +
            '</div>';
          infoWindows1[count] = new Tmapv2.InfoWindow({
            position: lonlat, //Popup 이 표출될 맵 좌표
            content: content, //Popup 표시될 text
            type: 2, //Popup의 type 설정.
            border: '0px solid #FF0000',
            map: map, //Popup이 표시될 맵 객체
          });
          markers2.push(marker);
          count++;
          removecount = 1;
        }
      }
    }
  }
}

function removeMarkers() {
  for (let i = 0; i < markers2.length; i++) {
    markers2[i].setMap(null);
  }
  markers2 = [];
}

function onClose(count) {
  infoWindows1[count].setVisible(false);
}

function onClose2(count) {
  infoWindows2[count].setVisible(false);
}

function changeInfo(address, avgGrade, resultData) {
  evalAvgNum.innerText = `${avgGrade}`;
  loca.innerText = `${address}`;
  managementInfo.innerText = `${resultData[0].institutionNm} / ${resultData[0].phoneNumber}`;
}

function callClick() {
  let num = document
    .querySelector('.management__detail')
    .textContent.split(' / ')[1];
  location.href = 'tel:' + num;
}

function markerEvent(address, context, resultData) {
  const avgTemp = context.split(' ');
  id = parseInt(avgTemp[0]);
  avgSum = parseInt(avgTemp[1]);
  avgCount = parseInt(avgTemp[2]);
  avgGrade = (avgSum / parseFloat(avgCount)).toFixed(1);

  if (avgCount == 0) {
    avgGrade = '0.0';
  }

  bottomSheet.classList.remove('init');
  report.classList.remove('init');

  bulbArr.forEach((bulb) =>
    bulb.addEventListener('click', () => {
      setBulbRate(bulb, id, avgSum, avgCount);
    })
  );

  if (bottomSheet.classList.contains('up')) {
    changeInfo(address, avgGrade, resultData);
  } else {
    changeInfo(address, avgGrade, resultData);
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

function initTmap() {
  map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
    width: '100%',
    height: '100%',
    zoom: 15,
    zIndexMarker: '8',
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  getAddress(center._lat, center._lng);
  loadGetLonLatFromAddress(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);
  map.addListener('touchstart', touchstart);
  map.addListener('touchend', touchend);

  var onlongtouch; 
  var timer;
  var touchduration = 1000; //length of time we want the user to touch before we do something

  touchstart() {
    timer = setTimeout(onlongtouch, touchduration); 
  }

  touchend() {
    //stops short touches from firing the event
    if (timer)
      clearTimeout(timer); // clearTimeout, not cleartimeout..
  }

  onlongtouch = function (e) {
    //롱터치 실행 시 기능들
    if (roadcount != 0) {
      // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
      removeMarkers();

      lonlat = e.latLng;

      var count = 0;
      for (var i = 0; i < 1; i++) {
        for (var j = 0; j < 1; j++) {
          marker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(lonlat.lat(), lonlat.lng()), //Marker의 중심좌표 설정.
            map: map, //Marker가 표시될 Map 설정.
          });
          infoWindows1.push(infoWindow);
          if (infoWindows1[count] != null) {
            infoWindows1[count].setVisible(false);
          }
          if (roadcount != 0) {
            let content =
              "<div class='info_container' style='position: static; display: flex; flex-direction: column; font-size: 18px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 170px; background: #FFFFFF 0% 0% no-repeat padding-box;'>" +
              "<a class='btn-close' style='position: absolute; top: 5px; right: 5px; display: block; width: 15px; height: 15px; background: url(static/img/x.png) center;' href='javascript:void(0)' onclick='onClose(" +
              count +
              ")' ></a>" +
              "<div class='info-box'>" +
              "<p style='display: block;height: 20px;padding-right:20px;padding-top:5px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='startFn(" +
              lonlat.lat() +
              ',' +
              lonlat.lng() +
              '); onClose(' +
              count +
              ");'>여기를 출발지로 지정</a></p>" +
              "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='destinationFn(" +
              lonlat.lat() +
              ',' +
              lonlat.lng() +
              '); onClose(' +
              count +
              ");'>여기를 목적지로 지정</a></p>" +
              '</div>' +
              "<a href='javascript:void(0)' onclick='onClose(" +
              count +
              ")' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; background: url(resources/images/sample/btn-close-w.svg) no-repeat center;'></a>" +
              '</div>' +
              '</div>';
            infoWindows1[count] = new Tmapv2.InfoWindow({
              position: lonlat, //Popup 이 표출될 맵 좌표
              content: content, //Popup 표시될 text
              type: 2, //Popup의 type 설정.
              border: '0px solid #FF0000',
              map: map, //Popup이 표시될 맵 객체
              setVisible: true,
            });
            markers2.push(marker);
            count++;
            removecount = 1;
          }
        }
      }
    }
  };

  let markers = [];
  let markers2 = [];

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
        icon: '/static/img/lamp-icon.png', //Marker의 아이콘.
        map: map, //Marker가 표시될 Map 설정.
        title: resultData[i].rdnmadr,
        label: `${resultData[i].id} ${resultData[i].avgSum} ${resultData[i].avgCount}`,
      });
      if (marker.title == undefined) {
        marker.setTitle(resultData[i].lnmadr);
      }
      markers.push(marker);
    }

    //Marker에 클릭이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('click', (evt) => {
        markerEvent(
          marker._marker_data.options.title,
          marker._marker_data.options.label,
          resultData
        );

        var count = 0;
        infoWindows2.push(infoWindow);
        if (infoWindows2[count] != null) {
          infoWindows2[count].setVisible(false);
        }
        if (roadcount != 0) {
          let content =
            "<div class='info_container' style='position: static; display: flex; flex-direction: column; font-size: 18px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 170px; background: #FFFFFF 0% 0% no-repeat padding-box;'>" +
            "<a class='btn-close' style='position: absolute; top: 5px; right: 5px; display: block; width: 15px; height: 15px; background: url(static/img/x.png) center;' href='javascript:void(0)' onclick='onClose2(" +
            count +
            ")' ></a>" +
            "<div class='info-box'>" +
            "<p style='display: block;height: 20px;padding-right:20px;padding-top:5px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='startFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            '); onClose2(' +
            count +
            ");'>여기를 출발지로 지정</a></p>" +
            "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='if(passList.length < 12){passFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            ');} onClose2(' +
            count +
            ");'>여기를 경유지로 지정</a></p>" +
            "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' onclick='destinationFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            '); onClose2(' +
            count +
            ");'>여기를 목적지로 지정</a></p>" +
            '</div>' +
            "<a href='javascript:void(0)' onclick='onClose2(" +
            count +
            ")' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; background: url(resources/images/sample/btn-close-w.svg) no-repeat center;'></a>" +
            '</div>' +
            '</div>';

          infoWindows2[count] = new Tmapv2.InfoWindow({
            position: new Tmapv2.LatLng(
              marker._marker_data.options.position._lat,
              marker._marker_data.options.position._lng
            ), //Popup 이 표출될 맵 좌표
            content: content, //Popup 표시될 text
            type: 2, //Popup의 type 설정.
            border: '0px solid #FF0000',
            map: map, //Popup이 표시될 맵 객체
          });
          count++;
        }
      })
    );
    // Marker에 터치이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('touchstart', (evt) => {
        markerEvent(
          marker._marker_data.options.title,
          marker._marker_data.options.label,
          resultData
        );
        var count = 0;
        infoWindows2.push(infoWindow);
        if (infoWindows2[count] != null) {
          infoWindows2[count].setVisible(false);
        }
        if (roadcount != 0) {
          let content =
            "<div class='info_container' style='position: static; display: flex; flex-direction: column; font-size: 18px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 170px; background: #FFFFFF 0% 0% no-repeat padding-box;'>" +
            "<a class='btn-close' style='position: absolute; top: 5px; right: 5px; display: block; width: 15px; height: 15px; background: url(static/img/x.png) center;' href='javascript:void(0)' ontouchstart='onClose2(" +
            count +
            ")' ></a>" +
            "<div class='info-box'>" +
            "<p style='display: block;height: 20px;padding-right:20px;padding-top:5px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' ontouchstart='startFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            '); onClose2(' +
            count +
            ");'>여기를 출발지로 지정</a></p>" +
            "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' ontouchstart='passFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            '); onClose2(' +
            count +
            ");'>여기를 경유지로 지정</a></p>" +
            "<p style='display: block;height: 20px;padding-right:20px; padding-left: 15px;font-size: 13px; color: #444;' ><a href='javascript:void(0);' ontouchstart='destinationFn(" +
            marker._marker_data.options.position._lat +
            ',' +
            marker._marker_data.options.position._lng +
            '); onClose2(' +
            count +
            ");'>여기를 목적지로 지정</a></p>" +
            '</div>' +
            "<a href='javascript:void(0)' onclick='onClose2(" +
            count +
            ")' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; background: url(resources/images/sample/btn-close-w.svg) no-repeat center;'></a>" +
            '</div>' +
            '</div>';
          infoWindows2[count] = new Tmapv2.InfoWindow({
            position: new Tmapv2.LatLng(
              marker._marker_data.options.position._lat,
              marker._marker_data.options.position._lng
            ), //Popup 이 표출될 맵 좌표
            content: content, //Popup 표시될 text
            type: 2, //Popup의 type 설정.
            border: '0px solid #FF0000',
            map: map, //Popup이 표시될 맵 객체
          });
          count++;
        }
        //Popup 객체 생성.
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
    let tData = new Tmapv2.extension.TData();

    let optionObj = {
      coordType: 'WGS84GEO', //응답좌표 타입 옵션 설정 입니다.
      addressType: 'A04', //주소타입 옵션 설정 입니다.
    };

    let params = {
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

    let jibunAdd = getAddrLoc(address2);

    adminCodeToViews(address + ' ' + jibunAdd);
  }

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {}

  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert('onError');
  }

  $(naviStartBtn).click(function () {
    $.ajax({
      method: 'POST',
      url: 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',
      async: false,
      data: {
        appKey: 'l7xx277bb41e41d345caae019ce5a6c7b6cb',
        startX: s_mk_lng,
        startY: s_mk_lat,
        endX: d_mk_lng,
        endY: d_mk_lat,
        passList: Pass,
        reqCoordType: 'WGS84GEO',
        resCoordType: 'EPSG3857',
        startName: '출발지',
        endName: '도착지',
      },
      success: function (response) {
        let resultData = response.features;

        //기존 그려진 라인 & 마커가 있다면 초기화
        if (resultdrawArr.length > 0) {
          for (let i in resultdrawArr) {
            resultdrawArr[i].setMap(null);
          }
          resultdrawArr = [];
        }

        drawInfoArr = [];
        for (let i in resultData) {
          //for문 [S]
          let geometry = resultData[i].geometry;
          let properties = resultData[i].properties;
          // let polyline_;
          if (geometry.type == 'LineString') {
            for (let j in geometry.coordinates) {
              // 경로들의 결과값(구간)들을 포인트 객체로 변환
              let latlng = new Tmapv2.Point(
                geometry.coordinates[j][0],
                geometry.coordinates[j][1],
                geometry.coordinates[j][2]
              );
              // 포인트 객체를 받아 좌표값으로 변환
              let convertPoint =
                new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
              // 포인트객체의 정보로 좌표값 변환 객체로 저장
              let convertChange = new Tmapv2.LatLng(
                convertPoint._lat,
                convertPoint._lng
              );
              // 배열에 담기
              drawInfoArr.push(convertChange);
            }
          } else {
            let markerImg = '';
            let pType = '';
            let size;
            if (properties.pointType == 'S') {
              //출발지 마커
              markerImg =
                'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
              pType = 'S';
              size = new Tmapv2.Size(24, 38);
            } else if (properties.pointType == 'E') {
              //도착지 마커
              markerImg =
                'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
              pType = 'E';
              size = new Tmapv2.Size(24, 38);
            }

            // 경로들의 결과값들을 포인트 객체로 변환
            let latlon = new Tmapv2.Point(
              geometry.coordinates[0],
              geometry.coordinates[1],
              geometry.coordinates[2]
            );

            // 포인트 객체를 받아 좌표값으로 다시 변환
            let convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
              latlon
            );

            let routeInfoObj = {
              markerImage: markerImg,
              lng: convertPoint._lng,
              lat: convertPoint._lat,
              pointType: pType,
            };
          }
        } //for문 [E]
        drawLine(drawInfoArr);
      },
      error: function (request, status, error) {
        console.log(
          'code:' +
            request.status +
            '\n' +
            'message:' +
            request.responseText +
            '\n' +
            'error:' +
            error
        );
      },
    });
  });

  function drawLine(arrPoint) {
    let polyline_;

    polyline_ = new Tmapv2.Polyline({
      path: arrPoint,
      strokeColor: '#DD0000',
      strokeWeight: 6,
      map: map,
    });
    resultdrawArr.push(polyline_);
  }

  // gps가져오는 부분
  navigator.geolocation.getCurrentPosition(function (position) {
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
    var lonlat = new Tmapv2.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
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
function fun2() {}
function fun3() {}
