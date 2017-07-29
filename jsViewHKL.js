

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
  //this.makeLayout(data_url_str, cell);
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

          //I've put makeLayouthere for now as variables won't show if put in initialisation
          t.makeLayout(url_str);
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
  this.dataset = [];
  this.syminf = [];
  this.ncol = [];

  function whiteSpaceFilter(str) {
    return /\S/.test(str);
  }

  for (var i=0;i<header.length;i++)  {
      var hlist = header[i].split(" ");
      var key   = hlist[0].toLowerCase();

      if (key == 'ncol')  {
          this.ncol = hlist.slice(1).filter(whiteSpaceFilter);
          this.numreflections = this.ncol[1];
      }
      else if (key == 'cell')  {
          this.cell = hlist.slice(1).join(" ");
      }
      else if (key == 'syminf')  {
          //Declare var which contain array position of start and end of space group name
          var x_start;
          var x_end;

          //Store hlist as an array with no whitespace between each element
          this.syminf = hlist.slice(1).filter(whiteSpaceFilter);

          //acquire position of arrays containing spacegroup
          for(q=0;q<this.syminf.length;q++)  {
              if (this.syminf[q].startsWith("'") == true)  {
                  var x_start = q;
              }
              if (this.syminf[q].endsWith("'") == true)  {
                  var x_end = q + 1;
              }
          }
          this.spacegroup = this.syminf.slice(x_start,x_end).join(" ");
      }
      else if (key == 'symm')  {
          this.symm.push ( hlist.slice(1).join('\n').replace(/\s/g, '') );
      }
      else if (key == 'reso')  {
          var reso = hlist.slice(1).filter(whiteSpaceFilter);

          this.lowreso = 1.0/Math.pow(reso[0], 2);
          this.highreso = 1.0/Math.pow(reso[1], 2);
      }
      else if (key == 'ndif')  {
          this.ndif = hlist.slice(1).filter(whiteSpaceFilter);

          for (var j=0;j<this.ndif;j++)  {
              this.dataset.push ( {} );
          }
      }
      //Put components of datasets into an datasets object
      else if (key == 'project')  {
          // create array that stores data in order as array without white-space
          var projectarray = hlist.slice(1).filter(whiteSpaceFilter);

          //Get dataset number from first element
          var x = parseInt(projectarray[0]);

          //Put rest of data in dataset object
          this.dataset[x].project = projectarray.slice(1).join(' ');
      }
      else if (key == 'crystal')  {
          var crystalarray = hlist.slice(1).filter(whiteSpaceFilter);
          var x = parseInt(crystalarray);
          this.dataset[x].crystal = crystalarray.slice(1).join(' ');
      }
      else if (key == 'dataset')  {
          var dsarray = hlist.slice(1).filter(whiteSpaceFilter);
          var x = parseInt(dsarray);
          this.dataset[x].ds = dsarray.slice(1).join(' ');
      }
      else if (key == 'dcell')  {
          var dcellarray = hlist.slice(1).filter(whiteSpaceFilter);
          var x = parseInt(dcellarray);
          this.dataset[x].dcell = dcellarray.slice(1).join(' ');
      }
      else if (key == 'dwavel')  {
          var dwavelarray = hlist.slice(1).filter(whiteSpaceFilter);
          var x = parseInt(dwavelarray);
          this.dataset[x].dwavel = dwavelarray.slice(1).join(' ');
      }
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
