// bottom-sheet.js와 공유를 위한 배열(전역변수)
var markers = [];

function initTmap() {
  var map = new Tmapv2.Map("map_div",
    {
      center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
      width: "100%",
      height: "100%",
      zoom: 15
    });

  //Marker 객체 생성.
  var marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(35.154092733693304, 128.0951165242879), //Marker의 중심좌표 설정.
    icon: "/static/img/lamp-icon-sm.png", //Marker의 아이콘.
    map: map //Marker가 표시될 Map 설정.
  });
  markers.push(marker);
  console.log(markers);
  console.log(markers[0]);

  //Marker 객체 생성.
  var marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), //Marker의 중심좌표 설정.
    icon: "/static/img/lamp-icon-sm.png", //Marker의 아이콘.
    map: map //Marker가 표시될 Map 설정..
  });
  markers.push(marker);
  console.log(markers);
  console.log(markers[1]);

  //Marker 객체 생성.
  var marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(35.154092733693304, 128.101165242879), //Marker의 중심좌표 설정.
    icon: "/static/img/lamp-icon-sm.png", //Marker의 아이콘.
    map: map //Marker가 표시될 Map 설정.
  });
  markers.push(marker);
  console.log(markers);
  console.log(markers[2]);
}

console.log(markers);
  console.log(markers[0]);
  console.log(markers[1]);
  console.log(markers[2]);
