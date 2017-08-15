

/*
 *  =================================================================
 *
 *    25.06.17   <--  Date of Last Modification.
 *                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  -----------------------------------------------------------------
 *
 *  **** Module  :  js-client/cofe.communication.js
 *       ~~~~~~~~~
 *  **** Project :  jsCoFE - javascript-based Cloud Front End
 *       ~~~~~~~~~
 *  **** Content :  validateUserData()
 *       ~~~~~~~~~  makeCommErrorMessage()
 *                  serverCommand()
 *                  serverRequest()
 *
 *
 *
 *  =================================================================
 *
 */


function jsViewHKL()  {

  this.method  = 'GET';
  this.endian  = false;
  this.sceneId = '';

  this.spacegroup = null;
  this.spacegroupconf = null;
  this.cell       = null;
  this.lowreso    = null;
  this.highreso   = null;
  this.latticenum  = null;
  this.ncols          = null;
  this.nrows          = null;
  this.numreflections = null;
  this.ndif           = null;

  this.reflections = null;
  this.symm = [];
  this.dataset = [];
  this.min = [];
  this.max = [];
  this.syminf = [];
  this.historyfiles = [];

  this.symm = [];
  this.dataset = [];
  this.syminf = [];
  this.historyfiles = [];
  //this.hkl_corrected = [];

  this.symm_matrix = [];

  this.numberMissing = []; // length will be equal to the number of columns

  this.tab3_maxNrows = 100;

}

jsViewHKL.prototype.calc_symm_hkl = function ()  {

  this.symm_matrix = [];
  for (var t=0; t<this.symm.length; t++)  {
    var T = [[0,0,0],[0,0,0],[0,0,0]];
    for (var n=0; n<3; n++)  {
      var p = 0;
      if (this.symm[t][n].startsWith('X'))
        T[n][0] = 1;
      do {
        p = this.symm[t][n].indexOf('+X',p);
        if (p>=0) {
          T[n][0] += 1;
          p++;
        }
      } while (p>=0);
      do {
        p = this.symm[t][n].indexOf('-X',p);
        if (p>=0)  {
          T[n][0] -= 1;
          p++;
        }
      } while (p>=0);
      p = 0;
      if (this.symm[t][n].startsWith('Y'))
        T[n][1] = 1;
      do {
        p = this.symm[t][n].indexOf('+Y',p);
        if (p>=0) {
          T[n][1] += 1;
          p++;
        }
      } while (p>=0);
      do {
        p = this.symm[t][n].indexOf('-Y',p);
        if (p>=0)  {
          T[n][1] -= 1;
          p++;
        }
      } while (p>=0);
      p = 0;
      if (this.symm[t][n].startsWith('Z'))
        T[n][2] = 1;
      do {
        p = this.symm[t][n].indexOf('+Z',p);
        if (p>=0) {
          T[n][2] += 1;
          p++;
        }
      } while (p>=0);
      do {
        p = this.symm[t][n].indexOf('-Z',p);
        if (p>=0)  {
          T[n][2] -= 1;
          p++;
        }
      } while (p>=0);
    }

    var similar = false;
    for (var k=0;(k<this.symm_matrix.length) && (!similar);k++)  {
      similar = true;
      for (var i=0;(i<3) && similar;i++)
        for (var j=0;(j<3) && similar;j++)
          similar = (T[i][j] == this.symm_matrix[k][i][j]);
    }

    if (!similar)
      this.symm_matrix.push ( T );

//alert ( ' ' + this.symm[t] + '\n' + T[0] + '\n' + T[1] + '\n' + T[2] );

  }
}

jsViewHKL.prototype.Init = function ( sceneId, data_url_str )  {
// general initialisation function

  this.method  = 'POST';
  this.sceneId = sceneId;

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

  this.reflections = reflections;

  function whiteSpaceFilter(str) {
    return /\S/.test(str);
  }

  for (var i=0;i<header.length;i++)  {
      var hlist = header[i].split(" ");
      var key   = hlist[0].toLowerCase();

      if (key == 'ncol')  {
          var x = hlist.slice(1).filter(whiteSpaceFilter);
          this.ncols          = x[0];
          this.numreflections = x[1];
          this.nrows          = reflections.byteLength/(4*this.ncols);
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
            this.symm.push( hlist.slice(1).join('').split(",") );
      }
      else if (key == 'reso')  {
          var reso = hlist.slice(1).filter(whiteSpaceFilter);

          this.lowreso = 1.0/Math.sqrt(reso[0]);
          this.highreso = 1.0/Math.sqrt(reso[1]);
      }
      else if (key == 'ndif')  {
          this.ndif = hlist.slice(1).filter(whiteSpaceFilter);

          for (var j=0;j<this.ndif;j++)  {
              var dataset = {};
              dataset.col_labels = [];
              dataset.col_types  = [];
              this.dataset.push ( dataset );
          }
      }
      //Put components of dataset into an dataset object
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
          //this.dataset[x].dcell = dcellarray.slice(1).join(' ');
          dcell = dcellarray.slice(1);
          this.dataset[x].dcell = '';
          for (var j=0;j<dcell.length;j++) {
            this.dataset[x].dcell += parseFloat(dcell[j]) + '&nbsp;';
            if (j==2)  this.dataset[x].dcell += '&nbsp;&nbsp;&nbsp;';
          }
      }
      else if (key == 'dwavel')  {
          var dwavelarray = hlist.slice(1).filter(whiteSpaceFilter);
          var x = parseInt(dwavelarray);
          this.dataset[x].dwavel = dwavelarray.slice(1).join(' ');
      }
      else if (key == 'mtzhist')  {
          for (var n = i+1; n < (header.length - 1); n++)
          {
              this.historyfiles.push( header[n] );
          }
      }
  }


  for (var i=0;i<header.length;i++)  {
      var hlist = header[i].split(" ");
      var key   = hlist[0].toLowerCase();
      if (key == 'column')
      {
          var col_array = hlist.slice(1).filter(whiteSpaceFilter);
          var x = col_array[4];
          this.dataset[x].col_labels.push ( col_array[0] );
          this.dataset[x].col_types.push ( col_array[1] );
          this.min.push ( col_array[2] );
          this.max.push ( col_array[3] );
      }
  }

  this.calc_symm_hkl ();
  this.calculateStats();

}

jsViewHKL.prototype.calculateStats = function()  {

  this.numberMissing = [];
  this.count = [];
  this.data_total = [];
  this.abs_data_total = [];
  this.s_squaredmin = [];
  this.s_squaredmax = [];
  for (var i=0;i<this.ncols;i++)  {
    this.numberMissing.push ( 0 );
    this.count.push( 0 );
    this.data_total.push( 0 );
    this.abs_data_total.push( 0 );
    this.s_squaredmin.push( 0 );
    this.s_squaredmax.push( 0 );
  }

  var col_count = 0;
  for (var d = 0; d<this.ndif; d++) {

    var hold = this.dataset[d].dcell.split('&nbsp;');

    var a = hold[0];
    var b = hold[1];
    var c = hold[2];
    var alpha = hold[6];
    var beta  = hold[7];
    var gamma = hold[8];

    var c1 = Math.cos(Math.PI*alpha/180.0);
    var c2 = Math.cos(Math.PI*beta/180.0);
    var c3 = Math.cos(Math.PI*gamma/180.0);

    var omega = 1/(1 -(c1*c1)-(c2*c2)-(c3*c3)+(2*c1*c2*c3));
    var m11 = omega*(1-(c1*c1));
    var m22 = omega*(1-(c2*c2));
    var m33 = omega*(1-(c3*c3));
    var m23;
    var m31;
    var m12;
    var m32 = m23 = omega*((c2*c3) - c1);
    var m13 = m31 = omega*((c3*c1) - c2);
    var m21 = m12 = omega*((c1*c2) - c3);

    for(var q = 0; q<this.dataset[d].col_labels.length; q++)  {
      var s_min =  Number.MAX_VALUE;
      var s_max = -Number.MAX_VALUE;
      for (var r = 0; r < this.nrows; r++) {
          if (!isNaN(this.get_value(r,col_count)))  {
              var h = this.get_value(r,0);
              var k = this.get_value(r,1);
              var l = this.get_value(r,2);

              var r1 = h/a;
              var r2 = k/b;
              var r3 = l/c;

              var s2 = (m11*r1*r1) + (m22*r2*r2) + (m33*r3*r3) + (2*m23*r2*r3) + (2*m31*r3*r1) + (2*m12*r1*r2);

              s_min = Math.min ( s_min,s2 );
              s_max = Math.max ( s_max,s2 );

          }
      }

      this.s_squaredmin[col_count] = 1.0/Math.sqrt( s_min );
      this.s_squaredmax[col_count] = 1.0/Math.sqrt( s_max );
      //alert ('this.s_squaredmin['+col_count+'] = '+ this.s_squaredmin[col_count]);
      //alert ('this.s_squaredmax['+col_count+'] = '+ this.s_squaredmax[col_count]);
      col_count++;

    }

  }


  for (var i=0;i<this.nrows;i++)  {
    for (var j=0;j<this.ncols;j++)  {
      var r = this.get_value ( i,j );
      if (isNaN(r))  {
        this.numberMissing[j]++;
      }
      else {
          this.count[j]++;
          this.data_total[j] += r;
          if (r<0) {
              this.abs_data_total[j] += -r;
          }
          else {
              this.abs_data_total[j] += r;
          }
      }
    }
  }
}

jsViewHKL.prototype.get_value = function ( row,col )  {
  return this.reflections.getFloat32((col + row*this.ncols)*4,this.endian);
}
