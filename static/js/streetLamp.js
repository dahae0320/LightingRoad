var xhr = new XMLHttpRequest();
var url = 'http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api'; /*URL*/
var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+'n9Pfhnwdrxh%2FiMJefGgPTp2AqXB6JERmRhzBvdbZHL7Cbneqc7N5j6TxUvNOis9Ri%2Fz0dFdM8jbOYhKcmWj2Qg%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('0'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /**/
queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('xml'); /**/
// queryParams += '&' + encodeURIComponent('lmpLcNm') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('installationCo') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('rdnmadr') + '=' + encodeURIComponent(''); /**/
queryParams += '&' + encodeURIComponent('lnmadr') + '=' + encodeURIComponent('가좌동'); /**/
// queryParams += '&' + encodeURIComponent('latitude') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('longitude') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('installationYear') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('installationType') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('phoneNumber') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('institutionNm') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('referenceDate') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('instt_code') + '=' + encodeURIComponent(''); /**/
// queryParams += '&' + encodeURIComponent('instt_nm') + '=' + encodeURIComponent(''); /**/

xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        alert('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
    }
};

xhr.send('');