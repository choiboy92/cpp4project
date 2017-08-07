
function make_bigcircle ( Hmax_data, Vmax_data )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    this.Hsep = 300/Hmax_data;
    this.Vsep = 300/Vmax_data;
    ctx.arc(350,325,307,0, Math.PI*2, 1);
    ctx.stroke();
}

function Hdraw_arrow ( col_labels )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 255, 0, 0.75)';
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.75)';
    ctx.lineWidth = 4;
    var linestart_x = 0;
    var linestart_y = 325;
    var lineend_x = 675;
    var lineend_y = linestart_y;

    ctx.font = '25px arial';
    ctx.fillText(col_labels, 670, 308);
    ctx.beginPath();
    ctx.moveTo(linestart_x, linestart_y);
    ctx.lineTo(lineend_x,lineend_y);
    ctx.stroke();

    ctx.moveTo(lineend_x,lineend_y-10);
    ctx.lineTo(lineend_x,lineend_y+10);
    ctx.lineTo(lineend_x + 15,lineend_y);
    ctx.closePath();
    ctx.fill();

  }


  function Vdraw_arrow (col_labels) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0, 255, 0, 0.75)';
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.75)';
      ctx.lineWidth = 4;

      var linestart_x = 350;
      var linestart_y = 650;
      var lineend_y = 15;
      var lineend_x = linestart_x;

      ctx.font = '25px arial';
      ctx.fillText(col_labels, 360, 20);

      ctx.beginPath();
      ctx.moveTo(linestart_x, linestart_y);
      ctx.lineTo(lineend_x,lineend_y);
      ctx.stroke();

      ctx.moveTo(lineend_x-10,lineend_y);
      ctx.lineTo(lineend_x+10,lineend_y);
      ctx.lineTo(lineend_x,lineend_y-15);
      ctx.closePath();
      ctx.fill();
  }

  function make_HKdot (h,k,V, minV, maxV) {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    var rad;
    var x = 350+(h*this.Hsep);
    var y = 325+(k*this.Vsep);
    // rad has to be something with minV and maxV.
    if (minV == 0) {
        minV = maxV/100;
    }
    if (V == minV) {
        rad = 0;
    }
    else {
        rad = (((((this.Hsep+this.Vsep)/4) - 1)*(Math.log10(V/minV)+1))/Math.log10(maxV/minV));
    }

    ctx.beginPath();
    ctx.arc(x,y,rad,0, Math.PI*2, 1);
    ctx.fillStyle = 'rgba(65, 65, 65, 1)';
    ctx.lineWidth = 0;
    ctx.fill();
    ctx.closePath();
  }

jsViewHKL.prototype.makeTab4 = function ()  {
    var tab4 = document.getElementById ( "tab4" );
    tab4.innerHTML ='<canvas id="hklzone" width="700" height="650">'+
    'Use a compatible browser</canvas><br/><button> A button element</button>';
    /*if ( this.dataset[0].max[0]>(this.dataset[0].max[1]||this.dataset[0].max[2]) )
    {
      var bigcircle = make_bigcircle( this.dataset[0].max[0] );
    }
    else if ( this.dataset[0].max[1]>(this.dataset[0].max[0]||this.dataset[0].max[2]) )
    {
      var bigcircle = make_bigcircle( this.dataset[0].max[1] );
    }
    else if ( this.dataset[0].max[2]>(this.dataset[0].max[0]||this.dataset[0].max[1]) )
    {
      var bigcircle = make_bigcircle( this.dataset[0].max[2] );
  }*/
    var bigcircle = make_bigcircle( this.dataset[0].max[0], this.dataset[0].max[1] );
    var ver_arrow = Vdraw_arrow( this.dataset[0].col_labels[1] );
    var hrz_arrow = Hdraw_arrow( this.dataset[0].col_labels[0] );
    //alert('Sep = '+ sep);

    for (var i = 0; i<this.nrows; i++) {
        var h = this.get_value ( i,0 );
        var k = this.get_value ( i,1 );
        var l = this.get_value ( i,2 );
        var V = this.get_value ( i,3 );
        var maxV = this.dataset[1].max[0];
        var minV = this.dataset[1].min[0];
        if (!isNaN(V))  {
           if (Math.abs(l)<0.000001)  {
              //draw circle at (h,k) with radius ~ math.log10(V)
              make_HKdot(h,k,V,minV,maxV);
              make_HKdot(-h,-k,V,minV,maxV);
              make_HKdot(-h,k,V,minV,maxV);
              make_HKdot(h,-k,V,minV,maxV);
          }
        }
    }
}
