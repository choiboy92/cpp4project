
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
    ctx.lineWidth = 4;
    var linestart_x = 0;
    var linestart_y = 325;
    var lineend_x = 675;
    var lineend_y = linestart_y;

    ctx.beginPath();
    ctx.font = '25px arial';
    ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
    ctx.fillText(col_labels, 670, 308);
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(250, 0, 0, 0.75)';
    ctx.moveTo(linestart_x, linestart_y);
    ctx.lineTo(lineend_x,lineend_y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
    ctx.moveTo(lineend_x,lineend_y-10);
    ctx.lineTo(lineend_x,lineend_y+10);
    ctx.lineTo(lineend_x + 15,lineend_y);
    ctx.fill();
    ctx.closePath();

  }


  function Vdraw_arrow (col_labels) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = 4;

      var linestart_x = 350;
      var linestart_y = 650;
      var lineend_y = 15;
      var lineend_x = linestart_x;

      ctx.beginPath();
      ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
      ctx.font = '25px arial';
      ctx.fillText(col_labels, 360, 20);
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(250, 0, 0, 0.75)';
      ctx.moveTo(linestart_x, linestart_y);
      ctx.lineTo(lineend_x,lineend_y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle   = 'rgba(250, 0, 0, 0.75)';
      ctx.moveTo(lineend_x-10,lineend_y);
      ctx.lineTo(lineend_x+10,lineend_y);
      ctx.lineTo(lineend_x,lineend_y-15);
      ctx.fill();
      ctx.closePath();

  }


function erf(x){
    // erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
    // with using Taylor expansion,
    //        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
    // calculationg n=0 to 50 bellow (note that inside sigma equals x when n = 0, and 50 may be enough)
    var m = 1.00;
    var s = 1.00;
    var sum = x * 1.0;
    for(var i = 1; i < 50; i++){
        m *= i;
        s *= -1;
        sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
    }
    return 2 * sum / Math.sqrt(3.14159265358979);
}


  function make_HKdot (h,k,V, maxV) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      maxRad = (this.Hsep+this.Vsep)/4;
      var x = 350+(h*this.Hsep);
      var y = 325+(k*this.Vsep);

      ithresh   = 0.75;
      vcontrast = 0.5;
      rmin      = 1;
      rmax      = maxRad;

      Vmax = maxV*ithresh;

      val = Math.min(1.0,V/Vmax) - 0.5;
      val = (1.0 + erf(3.0*vcontrast*val)/erf(3.0*vcontrast/2.0))/2.0;

      val = Math.pow ( Math.abs(val),0.66 );

      logv = Math.max ( 0.0,val*Vmax );
      r2 = logv/Vmax;
      r2 = Math.max ( 1.02*rmin,rmax*Math.min(1.0,Math.sqrt(r2)) );
      r1 = rmax*vcontrast - rmax/Vmax*(Vmax-logv);
      r1 = Math.max ( 1.01*rmin,Math.sqrt(r1)  );
      r1 = Math.min ( r1,r2-0.01*rmin     );

      vm = Math.max ( Vmax*vcontrast,logv );
      vm = logv/vm;

      color_range = 230;

      if (vcontrast<=0.01)  c = 0;
                      else  c = Math.round(color_range*(1.0-Math.min(1.0,vm)));
      c = Math.max ( c,0   );
      c = Math.min ( c,255 );
      //alert('c = ' + c);

      //draw spot with radius 'r2' and color (c,c,c)
      ctx.beginPath();
      ctx.lineWidth = 0;
      ctx.arc(x,y,r2,0, Math.PI*2, 1);
      ctx.fillStyle = 'rgba('+c+', '+c+', '+c+', 1)';
      ctx.fill();
      ctx.closePath();
  }

jsViewHKL.prototype.makeTab4 = function ()  {
    var tab4 = document.getElementById ( "tab4" );
    tab4.innerHTML ='<canvas id="hklzone" width="700" height="650" >'+
    'Use a compatible browser</canvas><br>';

    var bigcircle = make_bigcircle( this.dataset[0].max[0], this.dataset[0].max[1] );
    var ver_arrow = Vdraw_arrow( this.dataset[0].col_labels[1] );
    var hrz_arrow = Hdraw_arrow( this.dataset[0].col_labels[0] );
    //alert('Sep = '+ sep);

    var maxV = this.dataset[1].max[0];
    var minV = this.dataset[1].min[0];
    //alert ( ' minV=' + minV + ', maxV=' + maxV);

    var HK_button = document.createElement ('button');
    var HL_button = document.createElement ('button');
    var KL_button = document.createElement ('button');
    tab4.appendChild( HK_button );
    tab4.appendChild( HL_button );
    tab4.appendChild( KL_button );
    $( HK_button ).button({
        label: "h k 0"
    });
    $( HL_button ).button({
        label: "h 0 l"
    });
    $( KL_button ).button({
        label: "0 k l"
    });
    $( HK_button ).click( function(event) {
        alert (' h k 0 has been clicked' );
    });
    $( HL_button ).click( function(event) {
        alert (' h 0 l has been clicked' );
    });
    $( KL_button ).click( function(event) {
        alert (' 0 k l has been clicked' );
    });
    for (var i = 0; i<this.nrows; i++) {
        var h = this.get_value ( i,0 );
        var k = this.get_value ( i,1 );
        var l = this.get_value ( i,2 );
        var V = this.get_value ( i,3 );
        if (!isNaN(V))  {
           if (Math.abs(l)<0.000001)  {
              //draw circle at (h,k) with radius ~ math.log10(V)
              make_HKdot (h,k,V,maxV);
              make_HKdot (-h,-k,V,maxV);
              make_HKdot (-h,k,V,maxV);
              make_HKdot (h,-k,V,maxV);
          }
        }
    }

}
