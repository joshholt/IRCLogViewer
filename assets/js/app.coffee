changeState = (data, desc, newUrl) -> window.history.pushState data, desc, newUrl

hydrateTemplate = (templateID, data)->
  templ = $("##{templateID}-templ").html()
  hydrated = $.mustache templ, data
  return hydrated

onData = (templateName)->
  return (data, textStatus, jqXHR)->
    report = hydrateTemplate templateName, data
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

  if window.location.pathname.indexOf('graphs') > -1
    # Implement Graph Loading
    # for now I'll do this manually
    templ = hydrateTemplate 'graphs', {}
    $('.page-header').remove()
    $('.row').remove()
    $("#content").append templ
  else if window.location.pathname.indexOf('archives') > -1
    # Implement Archive Loading
    # for not I'll do this manually
    templ = hydrateTemplate 'archives', {}
    $('.page-header').remove()
    $('.row').remove()
    $("#content").append templ
  else
    $.get "/developers/#{dow}", onData("everything")
