

function jsViewHKL()  {
  this.method  = 'GET';
  this.endian  = false;
  this.sceneId = '';

}

jsViewHKL.prototype.Init = function ( sceneId, data_url_str )  {
// general initialisation function

  this.method  = 'POST';
  this.sceneId = sceneId;

  // I moved this.makeLayout from the jsViewHKL.Init function
  // and put it in the load so that variables dont have to be
  // declared globally and it can be placed in the table
  this.makeLayout(data_url_str, cell);
}

jsViewHKL.prototype.Load = function ( url_str )  {

  //alert('URL_str = ' + url_str);
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

  alert ( 'header=\n' + header.join('\n') );

  this.symm = [];
  this.column = [];
  this.column_src = [];
  this.dataset    = [];

  for (var i=0;i<header.length;i++)
  {
      var hlist = header[i].split(" ");
      var key   = hlist[0].toLowerCase();

      if (key=='cell')
      {

          this.cell = hlist.slice(1).join(' ');

      }
      else if (key=='symm')
      {
          this.symm.push ( hlist.slice(1).join('\n').replace(/\s/g, '') );
      }
      else if (key=='ndif')
      {
          hlist = String(hlist);
          this.ndif = parseInt(hlist);
          alert (' hlist after slice = ' + this.ndif);

          for (var j=0;j<this.ndif;j++)
          {
              this.dataset.push ( {} );
          }
      }
      /*else if (key=='project')
      {
          var n = parseInt(hlist[1]);
          this.dataset[i].project = hlist.slice(2).join(' ');
      }*/

  }


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
