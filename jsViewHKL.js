

function jsViewHKL()  {
  this.method  = 'GET';
  this.endian  = false;
  this.sceneId = '';
}

jsViewHKL.prototype.Init = function ( sceneId )  {
// general initialisation function

  this.method  = 'POST';
  this.sceneId = sceneId;

  this.makeLayout();

}

jsViewHKL.prototype.Load = function ( url_str )  {

  var oReq = new XMLHttpRequest();
  oReq.open ( this.method, url_str, true );
  oReq.responseType = "arraybuffer";
  oReq.timeout      = 9999999;

  (function(t){

    function getHeaderOffset ( dataView,dataLength )  {
      var offset = 4*dataView.getUint32(4,t.endian) - 4;
      if ((offset>0) && (offset<dataLength))  {
        var spattern = 'VERS MTZ:';
        var matched  = true;
        for (var i=0;(i<spattern.length) && matched;i++)
          matched = spattern.codePointAt(i) == dataView.getUint8(offset+i);
        if (matched)  return offset;
                else  return -2;
      } else {
        return -1;
      }
    }

    oReq.onload = function(oEvent) {

      var arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {

        var dataView = new DataView(arrayBuffer);
        var hoffset  = getHeaderOffset ( dataView,arrayBuffer.byteLength );
        if (hoffset<0)  {
          t.endian = !t.endian;
          hoffset = getHeaderOffset ( dataView,arrayBuffer.byteLength );
        }

        if (hoffset<0)  {
          alert ( 'MTZ Header Offset could not been calculated. Corrupt file?' );
        } else  {

          var header = [];  // will be a list of 80-character strings
          for (var i=hoffset;i<arrayBuffer.byteLength;i+=80)  {
            var s = "";
            var imax = Math.min(i+80,arrayBuffer.byteLength);
            for (var j=i;j<imax;j++)
              s += String.fromCharCode ( dataView.getUint8(j) );
            header.push ( s );
          }

          var reflections = new DataView ( arrayBuffer,80,hoffset-80 );
          t.processData ( header,reflections );

        }

      } else {
        alert ( 'did not work!' );
      }

    };

  }(this))

  oReq.onerror = function()  {
    alert ( 'Cannot obtain a file at ' + url_str );
  }

  oReq.send(null);

}


jsViewHKL.prototype.processData = function ( header,reflections )  {

  //alert ( 'header=\n' + header.join('\n') );



  var S = "";
  for (var i=0;i<22;i++)
    S += reflections.getFloat32(i*4,this.endian) + ', ';
  S += ' ***\n';
  for (var i=22;i<44;i++)
    S += reflections.getFloat32(i*4,this.endian) + ', ';

  var n2 = reflections.byteLength/4;
  var n1 = n2 - 22;
  S += ' ###\n';
  for (var i=n1;i<n2;i++)
    S += reflections.getFloat32(i*4,this.endian) + ', ';

  //alert ( S );




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
