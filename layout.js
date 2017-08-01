

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
  td.innerHTML = '<td class="table-blue-td" colSpan="' + colSpan + '">' + data + '</td>';
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
// will return a reference to the content panel of the section (single accordeon widget)
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


jsViewHKL.prototype.makeLayout = function(data_url_str)  {

  var tab1 = document.getElementById("tab1");
  put_label ( '<h2>General data</h2>',tab1 );
  var table1 = make_table();
  tab1.appendChild ( table1 );
  make_row ( 'Path',data_url_str,table1 );
  make_row ( 'Type','Merged MTZ',table1 );
  make_row ( 'Resolution low',Math.round(100*this.lowreso)/100,table1 );
  make_row ( 'Resolution high',Math.round(100*this.highreso)/100,table1 );

  put_label ( '<p>',tab1 );

  //Add collapsable table data dynamically
  for (var i = 0; i < this.ndif; i++)
  {
      var datasetnum = i+1;
      var sectitle;
      if (i>0)  sectitle = 'Dataset #'+ datasetnum;
          else  sectitle = 'Columns common to all datasets';
      var panel    = make_section ( sectitle,tab1 );
      var table_ds = make_table();

      panel.appendChild ( table_ds );

      var trow = add_row ( 'Cell',table_ds );
      add_data ( this.dataset[i].dcell,6,trow );
      trow = add_row ( 'Wavelength',table_ds );
      add_data ( this.dataset[i].dwavel,6,trow );

      trow = add_row ( 'Column Label<br>Column Type',table_ds );
      for (var j=0;j<this.dataset[i].col_labels.length;j++)
        add_data ( this.dataset[i].col_labels[j]+<br>+this.dataset[i].col_types[j],1,trow );

      /*
      tab1.innerHTML += '<div id = "accordion"><h3> Dataset #'+ datasetnum +
      '</h3><table class="table-blue">'+
      '<tr><th>Cell</th><td>'+ this.dataset[i].dcell + '</td></tr>' +
      '<tr><th>Wavelength</th><td>'+ this.dataset[i].dwavel + '</td></tr>' +
      '<tr><th>Column Label</th><td> DATA for column labels</td></tr>' +
      '<tr><th>Column Type</th><td>DATA for column types</td></tr>' +
      '</table></div>';
      */
  }


/*
  tab1.innerHTML = '<h2>General data</h2>' +
    '<table class="table-blue">'+
    '<tr><th class="table-blue-vh">Path</th><td>'+ data_url_str +'</td></tr>' +
    '<tr><th>Type</th><td> Merged MTZ </td></tr>' +
    '<tr><th>Space Group</th><td>'+ this.spacegroup +'</td></tr>' +
    '<tr><th>Space Group Confidence</th><td> Data for Space group confidence </td></tr>' +
    '<tr><th>Cell</th><td>'+ this.cell +'</td></tr>' +
    '<tr><th>Resolution Low</th><td>'+ this.lowreso +'</td></tr>' +
    '<tr><th>Resolution High</th><td>'+ this.highreso +'</td></tr>' +
    '<tr><th>Number of Lattices</th><td> Data for Number of Lattices </td></tr>' +
    '<tr><th>Number of Reflections</th><td>'+ this.numreflections +'</td></tr>' +
    '<tr><th>Number of Datasets</th><td>'+ this.ndif +'</td></tr> </table>' +
    '<div id="accordion"><h3>Columns common to all datasets</h3>' +
    '<div><p>LOADS OF COLLLLUMNS</p></div></div>';

    //Add collapsable table data dynamically
    for (var i = 0; i < this.ndif; i++)
    {
        var datasetnum = i+1;
        tab1.innerHTML += '<div id = "accordion"><h3> Dataset #'+ datasetnum +
        '</h3><table class="table-blue">'+
        '<tr><th>Cell</th><td>'+ this.dataset[i].dcell + '</td></tr>' +
        '<tr><th>Wavelength</th><td>'+ this.dataset[i].dwavel + '</td></tr>' +
        '<tr><th>Column Label</th><td> DATA for column labels</td></tr>' +
        '<tr><th>Column Type</th><td>DATA for column types</td></tr>' +
        '</table></div>';
    }
*/

  var tab2 = document.getElementById ( "tab2" );
  tab2.innerHTML = '<h3>History</h3><p>' +
  //Print each line of historyfiles separated by a line break//
      this.historyfiles.join("<br/>") + '</p>' +
      '<h3>Summary</h3><p>' +
      '<table class="table-blue">' +
      ' <tr><th></th><th>Dataset</th><th>Group</th><th>Label</th><th>Min</th><th>Max</th>'+
      '<th>Number Missing</th><th>% Complete</th><th>Mean</th><th>Mean abs</th><th>Res. Low</th><th>Res. High</th></tr>'+
      ' <tr><td>Col___1</td><td>Col  2</td><td>COl  3</td><td>COl  3</td><td>COl  3</td><td>COl  3</td>'+
      '<td>COl  3</td><td>COl  3</td><td>COl  3</td><td>COl  3</td><td>COl  3</td><td>COl  3</td></tr>'

  var tab3 = document.getElementById ( "tab3" );
  var table = document.createElement ( 'table' );
  table.setAttribute ( 'id','table1' );
  table.setAttribute ( 'class','table-blue' );
  tab3.appendChild ( table );

  var row = document.createElement ( 'tr' );
  table.appendChild ( row );

  for (var i=0;i<3;i++)  {
    var cell = document.createElement ( 'td' );
    cell.innerHTML = 'CELL #' + i;
    row.appendChild ( cell );
  }

  var tab4 = document.getElementById ( "tab4" );
  tab4.innerHTML =
    '<canvas id="hklzone" width="300" height="150">Use a compatible browser</canvas>';
  var canvas = document.getElementById('hklzone');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.fillRect(75, 30, 50, 50);
  ctx.strokeRect(52.5,52.5,50,50);

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.fillRect(30, 30, 50, 50);

  ctx.fillStyle = 'orange';
  ctx.beginPath();
  ctx.moveTo(75, 50);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);
  ctx.fill();
}
