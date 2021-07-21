var markers = [];

const bottomSheet = document.querySelector('.bottom-sheet');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');

function markerEvent() {
  bottomSheet.classList.remove('init');
  report.classList.remove('init');

  if (bottomSheet.classList.contains('up')) {
    console.log('데이터 변경');
  } else {
    console.log('데이터 변경');
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
  var map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
    width: '100%',
    height: '100%',
    zoom: 15,
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  latLngDataToViews(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);

  function setMarker(resultData) {
    var positions = [];

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
      });
      markers.push(marker);
    }
  }

  //Marker에 클릭이벤트 등록.
  markers.forEach((marker) =>
    marker.addListener('click', (evt) => {
      markerEvent();
    })
  );

  //Marker에 터치이벤트 등록.
  markers.forEach((marker) =>
    marker.addListener('touchstart', (evt) => {
      markerEvent();
    })
  );

  function onDragend(e) {
    latLngDataToViews(e.latLng._lat, e.latLng._lng);
  }

  function onTouchend(e) {
    latLngDataToViews(e.latLng._lat, e.latLng._lng);
  }

  function latLngDataToViews(lat, lng) {
    $.ajax({
      type: 'POST',
      url: '',
      data: { lat: lat, lng: lng },
      success: function (response) {
        let data = response.replaceAll(`&quot;`, `"`);
        let placeData = JSON.parse(data);
        let resultData = placeData['response']['body']['items'];
        console.log(resultData);
        setMarker(resultData);
      },
      error: function () {
        console.log('실패-!');
      },
    });
  }
}
