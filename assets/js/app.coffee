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

handleArchives = ()->
  templ = hydrateTemplate 'archives', {}
  $('.page-header').remove()
  $('.row').remove()
  $("#content").append templ

  $.get '/archives/index', (data, textStatus, jqXHR) ->
    report = hydrateTemplate 'archiveInfo', data.records[0]
    $('#archive-info').remove()
    $('#archive-content').append report

    $('.modal-link').click (event) ->
      event.preventDefault();
      $('#archiveModal').remove();

      $.get $(this).attr("href"), (data, textStatus, jqXHR) ->
        $('body').append(hydrateTemplate( 'archiveModal', data))
        $('#archiveModal').modal 'toggle'

handleGraphs = ()->
  $('.page-header').remove()
  $('.row').remove()
  $("#content").append(hydrateTemplate( 'graphs', {}))

$ ->
  $("#loader").hide().ajaxStart(-> $(this).show()).ajaxStop(-> $(this).hide())
  today = (new Date()).getUTCDay()

  switch today
    when 1 then dow = "monday"
    when 2 then dow = "tuesday"
    when 3 then dow = "wednesday"
    when 4 then dow = "thursday"
    when 5,6,7 then dow = "friday"

  if window.location.pathname.indexOf('graphs') > -1
    handleGraphs()
  else if window.location.pathname.indexOf('archives') > -1
    handleArchives()
  else
    $.get "/developers/#{dow}", onData("everything")
