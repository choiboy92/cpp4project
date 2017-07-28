
jsViewHKL.prototype.makeLayout = function(data_url_str)  {
// general initialisation function
  //alert('URL_STR = ' = data_url_str);
  //alert ( 'makeLayout');
  //alert('cell = ' + cell);

  var tab1 = document.getElementById("tab1");
  tab1.innerHTML ='<p><hr></p><h3>General data</h3>' +
    '<table style="table-blue">'+
    '<tr><th>Path</th><td>'+ data_url_str +'</td></tr>' +
    '<tr><td>Type</td><td> Merged MTZ </td></tr>' +
    '<tr><td>Space Group</td><td>'+ this.spacegroup +'</td></tr>' +
    '<tr><td>Space Group Confidence</td><td> Data for Space group confidence </td></tr>' +
    '<tr><td>Cell</td><td>'+ this.cell +'</td></tr>' +
    '<tr><td>Resolution Low</td><td>'+ this.lowreso +'</td></tr>' +
    '<tr><td>Resolution High</td><td>'+ this.highreso +'</td></tr>' +
    '<tr><td>Number of Lattices</td><td> Data for Number of Lattices </td></tr>' +
    '<tr><td>Number of Reflections</td><td>'+ this.numreflections +'</td></tr>' +
    '<tr><td>Number of Datasets</td><td>'+ this.ndif +'</td></tr> </table>';
  var tab2 = document.getElementById ( "tab2" );
  tab2.innerHTML = '<h3>History</h3><p>' +
      'This is where history records of the file will go</p>' +
      '<h3>Summary</h3><p>' +
      'Here another table containing summary data will be placed</p>'

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
    '<table style="table-blue">' +
    ' <tr><th>Col1</th><th>Col2</th><th>COl3</th></tr>' +
    ' <tr><td>Col___1</td><td>Col  2</td><td>COl  3</td></tr>' +
    '</table>';

}
