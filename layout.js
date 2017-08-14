

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
          var min = Math.round(100*this.min[col_count])/100;
          var max = Math.round(100*this.max[col_count])/100;
          var num_miss = this.numberMissing[col_count];
          var complt   = Math.round(1000*(this.numreflections-num_miss)/this.numreflections)/10;
          var mean = '?';
          var mean_abs = '?';
          if (types != 'I') {
              mean = Math.round(100*this.data_total[col_count]/this.count[col_count])/100;
              mean_abs = Math.round(100*this.abs_data_total[col_count]/this.count[col_count])/100;
          }
          var lowres = Math.round(100*this.s_squaredmin[col_count])/100;
          var highres = Math.round(100*this.s_squaredmax[col_count])/100;
          make_summ_row((i+1),n,labels,types,min,max,num_miss,complt,mean,mean_abs,lowres,highres,table2);
          col_count++;
      }
  }

}

jsViewHKL.prototype.makeLayout = function(data_url_str)  {

  this.makeTab1 ( data_url_str );
  this.makeTab2 ();
  this.makeTab3 ();
  this.makeTab4 ();
}
