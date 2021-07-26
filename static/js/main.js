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
  let map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
    width: '100%',
    height: '100%',
    zoom: 15,
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  loadGetLonLatFromAddress(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);

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
      });
      markers.push(marker);
    }

    //Marker에 클릭이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('click', (evt) => {
        markerEvent();
      })
    );

    // Marker에 터치이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('touchstart', (evt) => {
        markerEvent();
      })
    );
  }

  function onDragend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function onTouchend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function latLngDataToViews(code) {
    $.ajax({
      type: 'POST',
      url: '',
      data: { code: code },
      success: function (response) {
        let data = response.replaceAll(`&quot;`, `"`);
        let placeData = JSON.parse(data);
        console.log(placeData);
        let resultData = placeData['response']['body']['items'];
        setMarker(resultData);
      },
      error: function () {
        console.log('실패-!');
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

    latLngDataToViews(address_code);
  }

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {
    //alert("onComplete");
  }

  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert('onError');
  }
}
