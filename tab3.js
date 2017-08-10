function make_table()  {
var table = document.createElement ('table')
  table.setAttribute ( 'class','table-blue' );
  table.setAttribute ( 'style','width:auto' );
  return table;
}


jsViewHKL.prototype.makeTable3 = function ( firstRow,table3 )  {

  table3.innerHTML = '';
  //make header row
  var header = document.createElement ( 'thead' );
  var trow = document.createElement ( 'tr' );
  header.appendChild ( trow );
  trow.innerHTML = '<th class="table-blue-vh"></th>';
  table3.appendChild ( header );

  var nn = 0;
  var kk = [];
  for (var n = 0; n < this.ndif; n++) {
      for (var q =0; q<this.dataset[n].col_labels.length; q++) {
          var th = document.createElement ( 'th' );
          th.setAttribute ( 'class','table-blue-hh' );
          th.innerHTML = this.dataset[n].col_labels[q];
          trow.appendChild ( th );
          nn++;
      }
  }

  //add reflection data
  var tbody = document.createElement( 'tbody' );
  for (var s = 0; s < 100; s++) {
      var rownum = firstRow + s + 1;
      var ls_row = document.createElement ( 'tr' );
      var th = document.createElement ( 'th' );
      th.setAttribute ( 'class','table-blue-hh' );
      th.innerHTML = rownum;
      ls_row.appendChild ( th );
      for (var d = 0; d <this.ncols; d++) {
          var r = Math.round(100*this.get_value( firstRow+s,d ))/100;
          var td = document.createElement ( 'td' );
          td.setAttribute ( 'class','table-blue-td' );
          if (isNaN(r)) {
              r = '?';
          }
          td.innerHTML = r;
          ls_row.appendChild ( td );
      }
      tbody.appendChild ( ls_row );
  }
  table3.appendChild ( tbody );

}


jsViewHKL.prototype.makeTab3 = function()  {

    var tab3 = document.getElementById ( "tab3" );

    var div = document.createElement ( "div" );
    div.style.width  = 'auto';
    div.style.height  = $(window).height() - 150 + 'px';
    $(div).css ({'overflow-x':'auto','overflow-y':'auto'});
    tab3.appendChild ( div );

    $(window).resize(function() {
      div.style.height  = $(window).height() - 150 + 'px';
    });

    var table3 = make_table();
    div.appendChild ( table3 );

    this.makeTable3 ( 0,table3 );
  // Add slider

   var spacer = document.createElement ( 'br');
   tab3.appendChild ( spacer );


   var foot_table = document.createElement( 'table' );
   tab3.appendChild( foot_table );

   var td_slide = document.createElement ('td');
   foot_table.appendChild(td_slide);
   td_slide.setAttribute ('style','width:80%' );
   slider = document.createElement ( 'div');
   td_slide.appendChild ( slider );
   (function(t){
     $( function() {
       $( slider ).slider({
         range: "max",
         min: 1,
         max: t.nrows-99,
         value: 1,
         slide: function( event, ui ) {
           t.makeTable3 ( ui.value-1,table3 );
           $(spinner).spinner( 'value', ui.value );
         }
       });
     });
  }(this))

  //Add spinner
  var td_spin = document.createElement ('td');
  foot_table.appendChild (td_spin);

  td_spin.setAttribute ( 'style','width:auto' );

  var spinner = document.createElement ( 'input' );
  spinner.setAttribute ('id',"spinner" );
  spinner.setAttribute ('value', "1");

  td_spin.appendChild ( spinner );
  (function(t){
    $( function() {
      $( spinner ).spinner({
          min: 1,
          max: t.nrows-99,
          step: 1,
          spin: function( event, ui ) {
            t.makeTable3 ( ui.value-1,table3 );
            $(slider).slider( 'value', ui.value );
          },
          change: function( event, ui )  {
              t.makeTable3 ( spinner.value-1, table3 );
              $(slider).slider( 'value', spinner.value );
          }
      });
    });
  }(this))
}
