function initTmap() {
  var map = new Tmapv2.Map("map_div",
    {
      center: new Tmapv2.LatLng(35.154092733693304, 128.0981165242879), // 지도 초기 좌표
      width: "100%",
      height: "100%",
      zoom: 15
    });
}