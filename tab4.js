
function make_bigcircle ( max_data )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    this.sep = 300/max_data;
    ctx.arc(350,325,300,0, Math.PI*2, 1);
    ctx.stroke();
}

function draw_arrow ( col_labels, orientation )  {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 255, 0, 0.75)';
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.75)';
    ctx.lineWidth = 5;

    if (orientation = 'horizontal') {
        var linestart_x = 0;
        var linestart_y = 325;
        var lineend_x = 675;
        var lineend_y = linestart_y;

        ctx.font = '25px arial';
        ctx.fillText(col_labels, 670, 308);
    }
    /*else if (orientation = 'angled') {
        // code to draw angled arrow
    }
    */
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

  function make_HKdot (h,k,V) {
    var canvas = document.getElementById('hklzone');
    var ctx = canvas.getContext('2d');
    var x = 350 + (k*this.sep);
    var y = 325 - (h*this.sep);
    var rad = Math.log10((V-minV)+10.0);
    ctx.beginPath();
    ctx.arc(x,y,rad,0, Math.PI*2, 1);
    ctx.fillStyle = 'rgba(65, 65, 65, 1)';
    ctx.lineWidth = 0;
    ctx.fill();
    ctx.closePath();
  }


//function to make rows for summary section
function make_summ_row( ds,grp,label,type,min,max,num_miss,complt,mean,mean_abs,lowres,highres, table) {
    var summ_row = document.createElement ( 'tr' );
    summ_row.innerHTML = '<td>'+ds+'</td><td>'+grp+'</td><td>'+label+'</td><td>'+type+'</td><td>'+
    min+'</td><td>'+max+'</td><td>'+num_miss+'</td><td>'+complt+'</td><td>'+mean+'</td><td>'+
    mean_abs+'</td><td>'+lowres+'</td><td>'+highres+'</td>';
    table.appendChild ( summ_row );
}


jsViewHKL.prototype.makeTab4 = function ()  {
    var tab4 = document.getElementById ( "tab4" );
    tab4.innerHTML ='<canvas id="hklzone" width="700" height="650">'+
    'Use a compatible browser</canvas><br/><button> A button element</button>';
    if ( this.dataset[0].max[0]>(this.dataset[0].max[1]||this.dataset[0].max[2]) )
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
    }
    var hrz_arrow = draw_arrow( this.dataset[0].col_labels[1], 'horizontal');
    //alert('Sep = '+ sep);

    for (var i = 0; i<this.nrows; i++) {
        var h = this.get_value ( i,0 );
        var k = this.get_value ( i,1 );
        var l = this.get_value ( i,2 );
        var V = this.get_value ( i,3 );
        if (!isNaN(V))  {
           if (Math.abs(l)<0.000001)  {
              //draw circle at (h,k) with radius ~ math.log10(V)
              make_HKdot(h,k,V);
          }
        }
    }
}
