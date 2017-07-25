

function jsViewHKL()  {
  this.method = 'GET';
}

jsViewHKL.prototype.Init = function ()  {
// general initialisation function

//  this.method = 'POST';

//  alert ( 'init called  method=' + this.method );

}

/*
$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob)))))
    {
        return {
            // create new XMLHttpRequest
            send: function(headers, callback){
		// setup all variables
                var xhr = new XMLHttpRequest(),
		url = options.url,
		type = options.type,
		async = options.async || true,
		// blob or arraybuffer. Default is blob
		dataType = options.responseType || "blob",
		data = options.data || null,
		username = options.username || null,
		password = options.password || null;

                xhr.addEventListener('load', function(){
			var data = {};
			data[options.dataType] = xhr.response;
			// make callback and send data
			callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);

		// setup custom headers
		for (var i in headers ) {
			xhr.setRequestHeader(i, headers[i] );
		}

                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});
*/


jsViewHKL.prototype.Load = function ( url_str )  {

//  alert ( 'load called, url_str=' + url_str + ', method=' + this.method );



//    http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/
//    http://www.ccp4.ac.uk/html/mtzformat.html

/*
$.ajax({
          url: "image.png",
          type: "GET",
          dataType: 'binary',
          headers:{'Content-Type':'image/png','X-Requested-With':'XMLHttpRequest'},
          processData: false,
          success: function(result){
          }
});
*/

  (function(t){

    $.ajax ({
      url     : url_str,
      async   : true,
      type    : t.method,
//      headers : {'Content-Type':'application/octet-stream','X-Requested-With':'XMLHttpRequest'},
//      contentType: 'application/octet-stream',
  //    contentType: false,
      processData: false,
      dataType: 'text'
    })
    .done   ( function(data){
      t.processData ( data );
    })
    .always ( function(){
  //    alert ( 'always' );
    })
    .fail   ( function(){
      alert ( 'error' );
    });

  }(this))

  this.parse ( 'XXXXX' );

}


jsViewHKL.prototype.processData = function ( data )  {
  var n = data.indexOf ( 'VERS MTZ:' );
  alert ( 'data len=' + data.length + ', ' + data.substr(n)  );
  var summary = this.parse ( data.substr(n) )
  alert ( 'summary = ' + JSON.stringify(summary) );

}


jsViewHKL.prototype.parse = function ( data )  {
var summary = {};

  summary.Type       = 'Merged MTZ';
  summary.SpaceGroup = 'P 21 21 21';
  summary.datasets   = [];

  var dataset1 = {};
  dataset1.A = 'A1';
  dataset1.B = 'B1';

  var dataset2 = {};
  dataset2.A = 'A2';
  dataset2.B = 'B2';

  summary.datasets.push ( dataset1 );
  summary.datasets.push ( dataset2 );

  return summary;

}
