/*
 *  =================================================================
 *
 *    16.08.17   <--  Date of Last Modification.
 *                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  -----------------------------------------------------------------
 *
 *  **** Project :  jsViewHKL - javascript-based
 *       ~~~~~~~~~
 *  **** Content :  functions to make fourth tab (HKL zone)
 *       ~~~~~~~~~
 *
 *  **** Author  :  Junho Choi
 *       ~~~~~~~~~
 *
 *  =================================================================
 */



function make_bigcircle ( Hmax_data, Vmax_data )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(10, 10, 10, 1)';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.Hsep = 300/Hmax_data;
    this.Vsep = 300/Vmax_data;
    ctx.beginPath();
    ctx.arc(350,325,310,0, Math.PI*2, 1);
    ctx.stroke();
    ctx.closePath();
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

//function to draw a single dot
  function make_each_dot (hval,vval,V, maxV) {
      var canvas = document.getElementById('hklzone');
      var ctx = canvas.getContext('2d');
      maxRad = (this.Hsep+this.Vsep)/5.0;
      var x = 350+(hval*this.Hsep);
      var y = 325-(vval*this.Vsep);

      ithresh   = 1.0;
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


jsViewHKL.prototype.add_options =  function () {
      var cnt = 1;
      for (var z = 1; z < this.ndif; z++) {
          for (var b = 0; b < this.dataset[z].col_labels.length; b++) {
              holder = document.createElement('option');
              holder.setAttribute('value', cnt);
              holder.innerHTML = this.dataset[z].col_labels[b];
              this.V_select.appendChild(holder);
              cnt++;
          }
      }
}

// function to draw all spots
function draw_all_spots ( t,zoneKey,zoneHeight )  {
  var maxV = t.max[t.V_val];
  switch (zoneKey) {
      case 0 : var bigcircle = make_bigcircle( t.max[0], t.max[1] );
               var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[1] );
               var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[0] );
               break;
      case 1 : var bigcircle = make_bigcircle( t.max[0], t.max[2] );
               var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[2] );
               var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[0] );
               break;
      case 2 : var bigcircle = make_bigcircle( t.max[1], t.max[2] );
               var ver_arrow = Vdraw_arrow( t.dataset[0].col_labels[2] );
               var hrz_arrow = Hdraw_arrow( t.dataset[0].col_labels[1] );
               break;
      default: ;

  }
  for (var i = 0; i<t.nrows; i++)  {
    var h = t.get_value ( i,0 );
    var k = t.get_value ( i,1 );
    var l = t.get_value ( i,2 );
    var V = t.get_value ( i,t.V_val );
    var T = t.symm_matrix;
    for (var j=0;j<t.symm_matrix.length;j++)  {
      /*
      var h1 = T[j][0][0]*h + T[j][0][1]*k + T[j][0][2]*l;
      var k1 = T[j][1][0]*h + T[j][1][1]*k + T[j][1][2]*l;
      var l1 = T[j][2][0]*h + T[j][2][1]*k + T[j][2][2]*l;
      */
      var h1 = T[j][0][0]*h + T[j][1][0]*k + T[j][2][0]*l;
      var k1 = T[j][0][1]*h + T[j][1][1]*k + T[j][2][1]*l;
      var l1 = T[j][0][2]*h + T[j][1][2]*k + T[j][2][2]*l;

      var x,y;
      switch (zoneKey)  {
        case 0 : if (Math.abs(l1-zoneHeight)<0.000001)
                   x =
                   y =
                   //make_each_dot ( h1,k1,V,maxV );
                break;
        case 1 : if (Math.abs(k1-zoneHeight)<0.000001)
        x =
        y =
                   //make_each_dot ( h1,l1,V,maxV );
                break;
        case 2 : if (Math.abs(h1-zoneHeight)<0.000001)
        x =
        y =
                   //make_each_dot ( k1,l1,V,maxV );
                break;
        default: ;
      }
      make_each_dot ( x,y,V,maxV );

/*
      switch (zoneKey)  {
        case 0 : if (Math.abs(l1-zoneHeight)<0.000001||Math.abs(l1+zoneHeight)<0.000001)
                   make_each_dot ( h1,k1,V,maxV );
                break;
        case 1 : if (Math.abs(k1-zoneHeight)<0.000001||Math.abs(k1+zoneHeight)<0.000001)
                   make_each_dot ( h1,l1,V,maxV );
                break;
        case 2 : if (Math.abs(h1-zoneHeight)<0.000001||Math.abs(h1+zoneHeight)<0.000001)
                   make_each_dot ( k1,l1,V,maxV );
                break;
        default: ;
      }
*/

    }
  }
}

  //make table to hold field sets
function make_fieldset_table (td1,td2,td3)  {
    var table = document.createElement ('table')
    var fieldset_table_tr = document.createElement ('tr');
    this.fieldset_table_td = [];
    for (var td = 0; td<3; td++)  {
        fieldset_table_td[td] = document.createElement('td');
        fieldset_table_tr.appendChild (fieldset_table_td[td]);
        table.appendChild (fieldset_table_tr);

    }
    fieldset_table_td[0].appendChild ( td1 );
    fieldset_table_td[1].appendChild ( td2 );
    fieldset_table_td[2].appendChild ( td3 );
    return table;
}

jsViewHKL.prototype.makeTab4 = function ()  {
    var tab4 = document.getElementById ( "tab4" );
    tab4.innerHTML ='<canvas id="hklzone" width="700" height="700">'+
    'Use a compatible browser</canvas><br>';

    /*
    var w = $(window).width ();
    var h = $(window).height();
    var canvas_size = Math.min (w,h) - 200;
    */

    make_bigcircle();

    //alert('Sep = '+ sep);

    this.V_val = 3;

    var fieldset1 = document.createElement ( 'fieldset' );
    var fieldset2 = document.createElement ( 'fieldset' );
    var fieldset3 = document.createElement ( 'fieldset' );
    var fieldset_table = make_fieldset_table (fieldset1, fieldset2, fieldset3);
    tab4.appendChild ( fieldset_table );


    $('<legend>Select a plane:</legend>' +
      '<label for="radio-1">h k 0</label>' +
      '<input type="radio" name="radio-1" id="radio-1" checked="checked">' +
      '<label for="radio-2">h 0 l</label>' +
      '<input type="radio" name="radio-1" id="radio-2">' +
      '<label for="radio-3">0 k l</label>' +
      '<input type="radio" name="radio-1" id="radio-3">' ).appendTo ( fieldset1 );
    $('<legend>Select data:</legend>' ).appendTo ( fieldset2 );
    $('<legend>Select zone level:</legend>').appendTo ( fieldset3 );


    $( "input[type='radio']" ).checkboxradio();

    //implement selectMenu
    this.V_select  = document.createElement ('select');
    this.add_options();
    fieldset2.appendChild( this.V_select  );

    //implement zone level spinner
    var spinner = document.createElement ( 'input' );
    spinner.setAttribute ('id',"zonelevel_spinner" );
    spinner.setAttribute ( 'style','width:60px' );
    spinner.setAttribute ('value', "0");
    fieldset3.appendChild ( spinner );

    this.zonelevel = 0;
    this.zonekey   = 0;

    (function(t){
        $( t.V_select ).selectmenu({
            select: function(event,ui)  {
                t.V_val = 2+ parseInt(ui.item.value);
                var maxV = t.max[t.V_val];
                $(spinner).spinner( 'value', 0 );
                draw_all_spots(t,t.zonekey, 0);
            }
        });
        $(spinner).spinner ({
            step: 1,
            spin: function( event, ui )  {
                t.zonelevel = ui.value;
                draw_all_spots(t, t.zonekey, t.zonelevel);
            }
        });
        $("#zonelevel_spinner").keypress(function (e) {
           if (e.keyCode == 13) {
             var val = $("#zonelevel_spinner").spinner( "value" );
             t.zonelevel = val;
             draw_all_spots(t, t.zonekey, t.zonelevel);
           }
        });

        draw_all_spots ( t, 0, 0);

        $('#radio-1').click(function()  {
            t.zonekey = 0;
            draw_all_spots(t, t.zonekey, t.zonelevel);

        });
        $('#radio-2').click(function(){
            t.zonekey = 1;
            draw_all_spots(t, t.zonekey, t.zonelevel);
        });
        $('#radio-3').click(function(){
            t.zonekey = 2;
            draw_all_spots(t, t.zonekey, t.zonelevel);
        });
    }(this))
}
