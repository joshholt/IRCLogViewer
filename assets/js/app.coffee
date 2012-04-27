changeState = (data, desc, newUrl) -> window.history.pushState data, desc, newUrl

onData = (templateName)->
  return (data, textStatus, jqXHR)->
    view = $("##{templateName}-templ").html()
    report = $.mustache view, data
    $('.page-header').remove()
    $('.row').remove()
    $(".container").append report

    $("#"+data.channel+"-"+data.day).addClass("active");
    $("li.active > a > i").addClass('icon-white')
      
    $("a.ajax-link").click (event)->
      event.preventDefault();
      $.get $(this).attr("href"), onData(templateName)

$ ->
  $("#loader").hide().ajaxStart(-> $(this).show()).ajaxStop(-> $(this).hide())
  d = new Date()
  dow = "monday" if d.getDay() is 1
  dow = "tuesday" if d.getDay() is 2
  dow = "wednesday" if d.getDay() is 3
  dow = "thursday" if d.getDay() is 4
  dow = "friday" if d.getDay() is 5
  $.get "/developers/#{dow}", onData("everything")

