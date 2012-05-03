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

  # do the graph stuff here.
  options =
    chart:
      renderTo: 'graphArea'
    title:
      text: 'Messages Daily'
    xAxis:
      type: 'datetime'
      tickInterval: (7*24*3600*1000)
      tickWidth: 0
      gridLineWidth: 1
      label:
        align: 'left'
        x: 3
        y: (-3)
    yAxis: [
      title:
        text: null
      labels:
        align: 'left'
        x: 3
        y: 16
        formatter: ->
          Highcharts.numberFormat this.value, 0
      showFirstLabel: false
    
    linkedTo: 0
    gridLineWidth: 0
    opposite: true
    title:
      text: null
    labels:
      align: 'right'
      x: -3
      y: 16
      formatter: ->
        Highcharts.numberFormat this.value, 0
    showFirstLabel: false
    ]
    legend:
      align: 'left'
      verticalAlign: 'top'
      y: 7
      floating: true
      borderWidth: 0
    tooltip:
      shared: true
      crosshairs: true
    plotOptions:
      series:
        cursor: 'pointer'
        point:
          events:
            click: ->
              hs.htmlExpand(null, { pageOrigin: { x: this.pageX, y: this.pageY }, headingText: this.series.name, maincontentText: "#{Highcharts.dateFormat("%A, %b %e, %Y", this.x)}:<br/>#{this.y} messages", width: 200})
        marker:
          lineWidth: 1
    series: [
      name: 'Messages'
    ]

  $.get '/archives/index', (data, textStatus, jqXHR)->
    ret = []
    months = data.records[0].years[0].months
    insertRecord = (rec) ->
      dte = Date.parse((new Date(rec.year, rec.month, rec.day)))
      cnt = rec.count
      ret.push [dte, cnt]
    for m in months
      insertRecord d for d in m.days
    options.series[0].data = ret
    chart = new Highcharts.Chart options


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
