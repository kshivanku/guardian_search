var url;
var query;
var page = 1;
var api_key = 'd9f40400-dacb-4e97-bbfd-dec0bd352210';
var year_section,year_text,articles,article_element, year;
var pyear = 0;

function initialize(){
  $("#search_field").keypress(function(event) {
    alert('Key pressed: ' + event.keyCode);
    if (event.which == 13 || event.which == 66) {
      $("#data").empty();
      $(".empty_screen").hide();
      page = 1;
      pyear = 0;
      event.preventDefault();
      query = $("#search_field").val();
      if(query){
        callapi();
      }
      else{
        $("#intro").show();
        console.log('no query entered');
      }
    }
  });
}

function callapi(){
    url = 'http://content.guardianapis.com/search?order-by=oldest&page=' + page + '&page-size=200&q=' + query + '&api-key=' + api_key;
    $.getJSON(url, gotGuardianData);
}

function gotGuardianData(data){
  if(data.response.results.length == 0){
    $("#no_result").append("<p> It doesn't look like "+query+" was ever in Guardian. Try something else.</p>");
    $("#no_result").show();
  }
  else{
    for(i = 0 ; i < data.response.results.length ; i++){
      year = data.response.results[i].webPublicationDate.split("-")[0];
      if(year != pyear){
        pyear = year;
        year_section = $('#data').append("<div class='year_section clearfix' id = " + year +" ></div>");
        year_text = $("#"+year).append("<p class='year'>"+year+"</p>");
        articles = $("#"+year).append("<div class='articles'></div>");
        article_element = $("#" + year + " .articles").append("<a class='article_element' target='_blank' href= "+data.response.results[i].webUrl+"></a>");
      }
      else {
        article_element = $("#" + year + " .articles").append("<a class='article_element' target='_blank' href= "+data.response.results[i].webUrl+"></a>");
      }
    }
    var currentPage = data.response.currentPage;
    var totalPages = data.response.pages;
    if(currentPage < totalPages){
      page = currentPage + 1;
      callapi();
    }
    else{
      console.log("All Done");
    }
    // console.log(data);
  }
}
