
jsViewHKL.prototype.makeLayout = function(data_url_str)  {
// general initialisation function
  //alert('URL_STR = ' = data_url_str);
  //alert ( 'makeLayout');
  //alert('cell = ' + cell);
  /*$( function() {
      $( "#accordion" ).accordion();
  });*/

  var tab1 = document.getElementById("tab1");
  tab1.innerHTML ='<h2>General data</h2>' +
    '<table class="table-blue">'+
    '<tr><th>Path</th><td>'+ data_url_str +'</td></tr>' +
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
        tab1.innerHTML += '<div id = "collapse"><h2> Dataset #'+ datasetnum +
        '</h2><table class="table-blue">'+
        '<tr><th>Cell</th><td>'+ this.dataset[i].dcell + '</td></tr>' +
        '<tr><th>Wavelength</th><td>'+ this.dataset[i].dwavel + '</td></tr>' +
        '<tr><th>Column Label</th><td> DATA for column labels</td></tr>' +
        '<tr><th>Column Type</th><td>DATA for column types</td></tr>' +
        '</table></div>';
    }

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
