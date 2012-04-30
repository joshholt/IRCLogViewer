changeState = (data, desc, newUrl) -> window.history.pushState data, desc, newUrl

onData = (templateName)->
  return (data, textStatus, jqXHR)->
    view = $("##{templateName}-templ").html()
    report = $.mustache view, data
    $('.page-header').remove()
    $('.row').remove()
    $("#content").append report

    $("#"+data.channel+"-"+data.day).addClass("active");
    $("li.active > a > i").addClass('icon-white')
      
    $("a.ajax-link").click (event)->
      event.preventDefault();
      $.get $(this).attr("href"), onData(templateName)

$ ->
  today = new Date()
  $("#loader").hide().ajaxStart(-> $(this).show()).ajaxStop(-> $(this).hide())
  switch today.getUTCDay()
    when 1 then dow = "monday"
    when 2 then dow = "tuesday"
    when 3 then dow = "wednesday"
    when 4 then dow = "thursday"
    when 5,6,7 then dow = "friday"

  $.get "/developers/#{dow}", onData("everything")

