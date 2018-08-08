$(document).ready(function(){
	
  $(".result_table").on('click','.list-group-item',function(e){
  	e.preventDefault();
	$("#UList").hide();
	$("#name_list").toggle();
	$("#side_sortby").hide();
	$(".wrapper").hide();
	// GetRecord by id when click identifier after search anytext
	id  = $(this).attr("value");
	$.get({
	    url: ip+"csw",
	    data : {
	        request : "GetRecordById",
	        service : "CSW",
	        Id : id,
	    },
	    dataType: "xml",
	    crossDomain: true,
	    success: function(xml){
	    $(xml).find('csw\\:Record').each(function(){
	      var identifier = $(this).find('dc\\:identifier').text();
	      var title = $(this).find('dc\\:title').text();
	      var creator = $(this).find('dc\\:creator').text();
	      var subject = $(this).find('dc\\:subject').text();
	      var date_create = $(this).find('dct\\:modified').text();
	      var type = $(this).find('dc\\:type').text();
	      var format = $(this).find('dc\\:format').text();
	      var source = $(this).find('dc\\:source').text();
	      var language = $(this).find('dc\\:language').text();
	      var coverage = $(this).find('ows\\:BoundingBox').text();
	      $("#result-box").append(
	        "<div class='table table-bordered detail'>"+
	            "<h4><i class='fas fa-hand-point-left' id='return_data'></i>  Detail Dataset</h4>"+
	        "<p class='title'>Name: </p>"+
	        "<p>"+identifier+"</p>"+
	        "<p class='title'>Title: </p>"+
	        "<p>"+title+"</p>"+
	        "<p class='title'>Date Create: </p>"+
	        "<p>"+date_create+"</p>"+
	        "<p class='title'>Downloads & Resources </p>"+
	        "<p><a href='"+ip+"csw/download/"+identifier+"''><i class='fas fa-download'></i> Download File</a></p>"+
	        "<p class='title'>Metadata </p>"+
	        "<table class='table'>"+
	          "<tbody>"+
	            "<tr>"+
	              "<td>Identifier: </td>"+
	              "<td>"+identifier+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Title</td>"+
	              "<td>"+title+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Date Create</td>"+
	              "<td>"+date_create+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Format</td>"+
	              "<td>"+format+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Source</td>"+
	              "<td>"+source+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Language</td>"+
	              "<td>"+language+"</td>"+
	            "</tr>"+
	            "<tr>"+
	              "<td>Coverage</td>"+
	              "<td>"+coverage+"</td>"+
	            "</tr>"+
	          "</tbody>"+
	        "</table>"+
	    "</div>");
	      
	      var bound = (filter_array(coverage.trim().split(" ")));
	      if (bound[0] !== undefined) {
	        var bounds = [[bound[1],bound[0]],[bound[3],bound[2]]];
	        mapfit = L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	        map.fitBounds(bounds);
	      }
	    });

	  },
	  error: function() {
	    alert("An error occurred while processing XML file.");
	  }
	});
  });
 });