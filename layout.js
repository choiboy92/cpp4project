
jsViewHKL.prototype.makeLayout = function()  {
// general initialisation function

  //alert ( 'makeLaoyt');

  var tab2 = document.getElementById ( "tabs-2" );
  tab2.innerHTML = '<h3>History</h3><p>' +
      'This is where history records of the file will go</p>' +
      '<h3>Summary</h3><p>' +
      'Here another table containing summary data will be placed</p>'

  var tab3 = document.getElementById ( "tabs-3" );
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

  var tab4 = document.getElementById ( "tabs-4" );
  tab4.innerHTML =
    '<table class="table-blue">' +
    ' <tr><th>Col1</th><th>Col2</th><th>COl3</th></tr>' +
    ' <tr><td>Col___1</td><td>Col  2</td><td>COl  3</td></tr>' +
    '</table>';

}
