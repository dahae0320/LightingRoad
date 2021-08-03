function getAddrLoc(add) {
  let emdNm;

  $.ajax({
    url: "https://www.juso.go.kr/addrlink/addrLinkApi.do", 
    type: "post", 
    data: {
      "confmKey": "devU01TX0FVVEgyMDIxMDgwMjAzMTQzOTExMTQ3Njc=",
      "currentPage": 1,
      "countPerPage": 10,
      "keyword": add,
      "resultType": "json",
      "firstSort": "location"
    }, 
    dataType: "json", 
    async: false,
    success: function (jsonStr) {
      // $("#list").html("");
      var errCode = jsonStr.results.common.errorCode;
      var errDesc = jsonStr.results.common.errorMessage;
      if (errCode != "0") {
        alert(errCode + "=" + errDesc);
      } else {
        if (jsonStr != null) {
          emdNm = jsonStr.results.juso[0].emdNm;
          // console.log(emdNm);
        }
      }
    }, 
    error: function (xhr, status, error) {
      alert("에러발생");
    }
  });

  return emdNm;
}


//특수문자, 특정문자열(sql예약어의 앞뒤공백포함) 제거
function checkSearchedWord(obj) {
  if (obj.value.length > 0) {
    //특수문자 제거
    var expText = /[%=><]/;
    if (expText.test(obj.value) == true) {
      alert("특수문자를 입력 할수 없습니다.");
      obj.value = obj.value.split(expText).join("");
      return false;
    }

    //특정문자열(sql예약어의 앞뒤공백포함) 제거
    var sqlArray = new Array(
      //sql 예약어
      "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
      "UNION", "FETCH", "DECLARE", "TRUNCATE"
    );

    var regex;
    for (var i = 0; i < sqlArray.length; i++) {
      regex = new RegExp(sqlArray[i], "gi");

      if (regex.test(obj.value)) {
        alert("\"" + sqlArray[i] + "\"와(과) 같은 특정문자로 검색할 수 없습니다.");
        obj.value = obj.value.replace(regex, "");
        return false;
      }
    }
  }
  return true;
}

function enterSearch() {
  var evt_code = (window.netscape) ? ev.which : event.keyCode;
  if (evt_code == 13) {
    event.keyCode = 0;
    getAddrLoc();
  }
}