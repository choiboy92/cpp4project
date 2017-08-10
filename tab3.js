
function make_table()  {
var table = document.createElement ('table')
  table.setAttribute ( 'class','table-blue' );
  table.setAttribute ( 'style','width:auto' );
  return table;
}


jsViewHKL.prototype.makeTable3 = function ( firstRow,table3 )  {

/*  -- old version
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
*/


  table3.innerHTML = '';

  //make header row
  var thead = document.createElement ( 'thead' );
  var trow  = document.createElement ( 'tr' );
  trow.innerHTML = '<th class="table-blue-hh"></th>';
//  trow.innerHTML = '<th></th>';

  for (var n = 0; n < this.ndif; n++) {
      for (var q =0; q<this.dataset[n].col_labels.length; q++) {
          var th = document.createElement ( 'th' );
//          th.setAttribute ( 'class','table-blue-hh' );
          var div = document.createElement ( 'div' );
          div.setAttribute ( 'label',this.dataset[n].col_labels[q] );
          th.appendChild ( div );
//          th.innerHTML = this.dataset[n].col_labels[q];
//          th.innerHTML = '<div label="' + this.dataset[n].col_labels[q] + '"></div>'
          trow.appendChild ( th );
      }
  }
  var th = document.createElement ( 'th' );
  th.setAttribute ( 'class','scrollbarhead' );
  trow.appendChild ( th );
  thead.appendChild ( trow );
  table3.appendChild ( thead );



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

/*
Making scrollable tables:
https://stackoverflow.com/questions/8232713/how-to-display-scroll-bar-onto-a-html-table
*/

    var tab3 = document.getElementById ( "tab3" );

    var div = document.createElement ( "div" );
    div.style.width  = 'auto';
    div.style.height = $(window).height() - 140 + 'px';
    div.style.width  = $(window).width () - 70 + 'px';
    $(div).css ({'overflow-x':'auto','overflow-y':'hidden'});
    tab3.appendChild ( div );

    var div1 = document.createElement ( "div" );
    div1.setAttribute ( 'class','scrollingtable' );
    div1.style.height = $(window).height() - 140 + 'px';
//    div1.style.width  = $(window).width () - 160 + 'px';
    div.appendChild ( div1 );
    var div2 = document.createElement ( "div" );
    div1.appendChild ( div2 );
    var div3 = document.createElement ( "div" );
    div2.appendChild ( div3 );

    $(window).resize(function() {
      div .style.height = $(window).height() - 140 + 'px';
      div .style.width  = $(window).width () - 70  + 'px';
      div1.style.height = $(window).height() - 140 + 'px';
    });

    var table3 = make_table();
    div3.appendChild ( table3 );

  this.makeTable3 ( 0,table3 );
  // Add slider

   var vspacer = document.createElement ( 'br');
   tab3.appendChild ( vspacer );

   var foot_table = document.createElement( 'table' );
   tab3.appendChild( foot_table );
   var foot_row = document.createElement( 'tr' );
   foot_table.appendChild ( foot_row );

   var td_slide = document.createElement ('td');
   foot_row.appendChild(td_slide);
   td_slide.setAttribute ('style','width:80%' );
   slider = document.createElement ( 'div');
   td_slide.appendChild ( slider );
   (function(t){
     $( function() {
       $( slider ).slider({
         range: "max",
         min: 1,
         max: t.nrows-t.tab3_maxNrows+1,
         value: 1,
         slide: function( event, ui ) {
           t.makeTable3 ( ui.value-1,table3 );
           $(spinner).spinner( 'value', ui.value );
         }
       });
     });
  }(this))

  //Add spacer
  var hspacer1 = document.createElement ('td');
  hspacer1.setAttribute ( 'style','width:auto' );
  hspacer1.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
  foot_row.appendChild ( hspacer1 );

  //Add spinner
  var td_spin = document.createElement ('td');
  foot_row.appendChild (td_spin);

  td_spin.setAttribute ( 'style','width:20%' );

  var spinner = document.createElement ( 'input' );
  spinner.setAttribute ('id',"spinner" );
  spinner.setAttribute ( 'style','width:60px' );
  spinner.setAttribute ('value', "1");

  td_spin.appendChild ( spinner );
  (function(t){
    $( function() {
      $( spinner ).spinner({
          min: 1,
          max: t.nrows-t.tab3_maxNrows+1,
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

    $("#spinner").keypress(function (e) {
       if (e.keyCode == 13) {
         var val = $("#spinner").spinner( "value" );
         t.makeTable3 ( val-1, table3 );
         $(slider).slider( 'value', val );
 //          alert('You pressed enter!');
       }
    });

  }(this))

  var label1 = document.createElement ('td');
  label1.setAttribute ( 'style','width:auto' );
  label1.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;Go to reflection:&nbsp;&nbsp;&nbsp;H=';
  $(label1).css({'white-space':'nowrap'});
  foot_row.appendChild ( label1 );

  var td = document.createElement ('td');
  var inputH = document.createElement ( 'input' );
  inputH.setAttribute ( 'style','width:40px' );
  inputH.setAttribute ( 'id','inputH' );
  inputH.setAttribute ( 'type','text' );
  inputH.setAttribute ( 'value','12'  );
  td.appendChild ( inputH );
  foot_row.appendChild ( td );

  (function(t){
    $("#inputH").keypress(function (e) {
       if (e.keyCode == 13) {
         alert('You pressed enter!');
       }
    });
  }(this))

}
