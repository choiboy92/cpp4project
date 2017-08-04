

function make_table()  {
var table = document.createElement ('table')
  table.setAttribute ( 'class','table-blue' );
  table.setAttribute ( 'style','width:auto' );
  return table;
}

function make_row ( title,data,table )  {
  if (data!=null)  {
    var trow = document.createElement ( 'tr' );
    trow.innerHTML = '<th class="table-blue-vh">' + title + '</th><td>' + data + '</td>';
    table.appendChild ( trow );
  }
}

function add_row ( title,table )  {
  var trow = document.createElement ( 'tr' );
  trow.innerHTML = '<th class="table-blue-vh">' + title + '</th>';
  table.appendChild ( trow );
  return trow;
}

function add_data ( data,colSpan,trow )  {
  var td = document.createElement ( 'td' );
  td.setAttribute ( 'class','table-blue-td' );
  td.setAttribute ( 'colSpan',colSpan       );
  td.innerHTML = data;
  trow.appendChild ( td );
  return td;
}

function add_stretch ( stretch_val,colSpan,trow )  {
  var td = document.createElement ( 'td' );
  td.setAttribute ( 'class','table-blue-td' );
  td.setAttribute ( 'colSpan',colSpan       );
  td.setAttribute ( 'style','width:'+stretch_val );
  td.innerHTML = '&nbsp;';
  trow.appendChild ( td );
  return td;
}


function put_label ( text,element )  {
  var label = document.createElement ( 'span' );
  label.innerHTML = text;
  element.appendChild ( label );
}

var id_counter = 0;

function make_section ( title,element )  {
// will return a reference to the content panel of the section (single accordion widget)
var div    = document.createElement ( 'div' );
var header = document.createElement ( 'h3'  );
var panel  = document.createElement ( 'div' );

  var id = 'accordion_' + id_counter++;
  div.setAttribute ( 'id',id );
  header.innerHTML = title;
  div.appendChild ( header );
  div.appendChild ( panel  );
  element.appendChild ( div );

  $('#'+ id).accordion({
    active      : false,
    collapsible : true,
    heightStyle : "content"
  });

  return panel;

}

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
    var rad = Math.log10(V);
    ctx.beginPath();
    ctx.arc(x,y,rad,0, Math.PI*2, 1);
    ctx.fillStyle = 'rgba(65, 65, 65, 1)';
    ctx.lineWidth = 1;
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


jsViewHKL.prototype.makeTab1 = function(data_url_str)  {

  var tab1 = document.getElementById("tab1");
  put_label ( '<h2>General data</h2>',tab1 );
  var table1 = make_table();
  tab1.appendChild ( table1 );
  make_row ( 'Path',data_url_str,table1 );
  make_row ( 'Type','Merged MTZ',table1 );
  make_row ( 'Space group', this.spacegroup, table1 );
  make_row ( 'Space group confidence', this.spacegroupconf, table1 );
  make_row ( 'Cell (a,b,c,&alpha;,&beta;,&gamma;)', this.cell, table1 );
  make_row ( 'Resolution low',Math.round(100*this.lowreso)/100,table1 );
  make_row ( 'Resolution high',Math.round(100*this.highreso)/100,table1 );
  make_row ( 'Number of Lattices', this.latticenum, table1 );
  make_row ( 'Number of Reflections', this.numreflections, table1 );
  make_row ( 'Number of Datasets', this.ndif, table1 );

  put_label ( '<p>',tab1 );

  //Add collapsable table data dynamically
  for (var i = 0; i < this.ndif; i++)
  {
      var datasetnum = i+1;
      var sectitle;
      if (i==0)  sectitle = 'Columns common to all datasets';
           else  sectitle = 'Dataset #'+ datasetnum;
      var panel    = make_section ( sectitle,tab1 );
      var table_ds = make_table();

      panel.appendChild ( table_ds );

      var trow = add_row ( 'Cell (a,b,c,&alpha;,&beta;,&gamma;)',table_ds );
      add_data ( this.dataset[i].dcell,6,trow );
      trow = add_row ( 'Wavelength',table_ds );
      add_data ( this.dataset[i].dwavel,6,trow );

      trow = add_row ( 'Column Label<br>Column Type',table_ds );
      for (var j=0;j<this.dataset[i].col_labels.length;j++)
      add_data ( '<center>' + this.dataset[i].col_labels[j] + '<br><i>' +
                 this.dataset[i].col_types[j] + '</i></center>',1,trow );
      add_stretch ( '95%',1,trow );
  }

}


jsViewHKL.prototype.makeTab2 = function()  {

  var tab2 = document.getElementById ( "tab2" );
  put_label ( '<h2>History</h2><p>'+this.historyfiles.join("<br/>") + '</p>',tab2 );
  put_label ( '<h2>Summary</h2>',tab2 );
  var table2 = make_table();
  tab2.appendChild ( table2 );

  var title_row = document.createElement ( 'tr' );
  title_row.setAttribute ( 'class','table-blue-hh' );
  title_row.innerHTML = '<td title="Dataset serial number">Dataset</td><td>Group</td><td>Label</td><td>Type</td><td>Min</td><td>Max</td>'+
  '<td>Number<br>Missing</td><td>% Complete</td><td>Mean</td><td>Mean<br>abs</td><td>Reso.<br>Low</td><td>Reso.<br>High</td>';
  table2.appendChild ( title_row );

  //One loop for number of datasets
  //other loop for components of each dataset
  var col_count = 0;
  for (var i = 0; i < this.ndif; i++) {
      for (var n = 0; n < this.dataset[i].col_labels.length; n++) {
          var labels = this.dataset[i].col_labels[n];
          var types =  this.dataset[i].col_types[n];
          var min = Math.round(100*this.dataset[i].min[n])/100;
          var max = Math.round(100*this.dataset[i].max[n])/100;
          var num_miss = this.numberMissing[col_count];
          var complt   = Math.round(1000*(this.numreflections-num_miss)/this.numreflections)/10;
          var mean = Math.round(100*this.data_total[col_count]/this.count[col_count])/100;
          var mean_abs = Math.round(100*this.abs_data_total[col_count]/this.count[col_count])/100;
          var lowres = null;
          var highres = null;
          make_summ_row((i+1),n,labels,types,min,max,num_miss,complt,mean,mean_abs,lowres,highres,table2);
          col_count++;
      }
  }

}

jsViewHKL.prototype.makeTab3 = function()  {
    //make table
    var tab3 = document.getElementById ( "tab3" );
    var table3 = make_table();
    tab3.appendChild ( table3 );

    //make header row
    var trow = document.createElement ( 'tr' );
    trow.innerHTML = '<th class="table-blue-vh"></th>';
    table3.appendChild ( trow );
    for (var n = 0; n < this.ndif; n++) {
        for (var q =0; q<this.dataset[n].col_labels.length; q++) {
            var td = document.createElement ( 'th' );
            td.setAttribute ( 'class','table-blue-hh' );
            td.innerHTML = this.dataset[n].col_labels[q];
            trow.appendChild ( td );
        }
    }
    //add reflection data
    for (var s = 0; s < 100; s++) {
        var rownum = s+1;
        var ls_row = document.createElement ( 'tr' );
        table3.appendChild ( ls_row );
        for (var d = 0; d <= this.ncols; d++) {
            var r = Math.round(100*this.get_value( s,d ))/100;
            if (isNaN(r)){
                r = '?';
            }
            var td = document.createElement ( 'td' );
            td.setAttribute ( 'class','table-blue-td' );
            if (d == 0) {
                td.setAttribute ( 'class','table-blue-hh' );
                td.innerHTML = rownum;
            }
            else  {
                td.innerHTML = r;
            }
            ls_row.appendChild ( td );
        }
    }
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
        if (l==0.0)  {
            //draw circle at (h,k) with radius ~ math.log10(V)
            make_HKdot(h,k,V);
        }
    }
}

jsViewHKL.prototype.makeLayout = function(data_url_str)  {

  this.makeTab1 ( data_url_str );
  this.makeTab2 ();
  this.makeTab3 ();
  this.makeTab4 ();
}
