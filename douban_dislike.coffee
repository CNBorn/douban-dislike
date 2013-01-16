refresh_interval = 850

hide_site_hot_content = ->
  $("div.guess-item:has(div.source:contains('热点'))").hide()

show_site_hot_content = ->
  $("div.guess-item:has(div.source:contains('热点'))").show()

add_site_hot_content_options = ->
  is_show_hot_site_content = localStorage.getItem('option_show_site_hot_content') == "true"
  $("div.guess3-setting div.hd:not(:has(input#show_site_hot_content))").prepend("<input id=show_site_hot_content type=checkbox><label for=show_site_hot_content>显示全站热点</label>")
  $("input#show_site_hot_content").attr("checked", is_show_hot_site_content)
  $("input#show_site_hot_content").click ->
    shsc_value = $(this).attr("checked") == "checked"
    localStorage.setItem('option_show_site_hot_content', shsc_value)
    if shsc_value then show_site_hot_content() else hide_site_hot_content()

refresh_site_hot_content = ->
  shsc_value = $("input#show_site_hot_content").attr("checked") == "checked"
  if shsc_value then show_site_hot_content() else hide_site_hot_content()

remove_already_liked_content = ->
  $("div.guess-item:has(div.ft span.fav-btn a.selected)").remove()
  $("div.guess-item:has(div.ft span.subject-btn a.selected)").remove()
  $("div.guess-item:has(div.ft span.online-event-btn a.selected)").remove()
  $("div.guess-item:has(div.ft span.event-btn a.selected)").remove()

refresh_unread_count = ->
  douban_home_link = $("div.site-nav-items ul li:eq(0) a")
  unread_count = $("div.guess-item").length
  if unread_count > 0
    douban_home_link.text("豆瓣(#{unread_count})")

refresh_guess_items_and_unread_count = ->
  guess_item = $("div.guess-item:first")
  get_user_id = ->
    user_id = $("div.guess-item[id*=':']:not([id^='other']):first").attr("id").split(":")[0]
    localStorage.douban_dislike_user_id = user_id
    return user_id

  user_id = get_user_id()
  if not user_id then return false

  $.ajax(
    type: "GET"
    url: "http://50.116.13.151/douban_dislikes/dislikes"
    data:
      user_id: user_id
  ).done (received) =>
    dislikes = received['dislikes']
    for dislike in dislikes
      $("div.guess-item[unique_id='#{dislike}']").remove()
    refresh_unread_count()

  
put_dislike_button = ->
  $("div.guess-item div.ft:not(:has(span.dislike-btn))").append('<span class="usr-btn fav-btn dislike-btn"><a href>不喜欢</a></span>')

  $("div.guess-item").delegate "div.ft span.dislike-btn a", "click", (evt) ->
    guess_item = $(this).parent().parent().parent()
    get_user_id = ->
      user_id = $("div.guess-item[id*=':']:not([id^='other']):first").attr("id").split(":")[0]
    get_kind_and_id = ->
      guess_item.attr("unique_id").split(":")
    [kind, id] = get_kind_and_id()
    user_id = get_user_id()
    if not user_id then return false

    save_dislike = (user_id, kind, id) ->
          
    $.ajax(
      type: "GET",
      url: "http://50.116.13.151/douban_dislikes",
      data:
        kind: kind
        target_id: id
        user_id: user_id
    ).done (msg) =>
      guess_item.remove()
      refresh_unread_count()

    save_dislike(user_id, kind, id)
    event.preventDefault()

put_expand_note_button = ->
  $("div.guess-item[unique_id^=1015] div.source:not(:has(span.expand-note-btn))").append('<span class="usr-btn expand-note-btn"><a href>展开</a></span>')

  $("div.guess-item[unique_id^=1015] div.source span.expand-note-btn a").unbind("click").click ->
    guess_item = $(this).parent().parent().parent().parent()
    [guess_item_note_kind, guess_item_note_id] = $(guess_item[0]).attr("unique_id").split(":")

    $.ajax(
      type: "GET"
      url: "http://www.douban.com/note/#{guess_item_note_id}/"
      headers: {
           "Content-Type": "text/html"
      }
    ).done (received_html) ->
      note_context = $("div.note:last", received_html)
      if note_context.length == 0 then note_context = $("div.note-content:last", received_html)
      $("div.content div.desc", guess_item).html(note_context)
      $("div.source span.loading", guess_item).remove()

    $(this).parent().html('<span class="loading">加载中……</span>')
    event.preventDefault()

dislike_init = ->
  add_site_hot_content_options()

dislike_refresh_all = ->
  refresh_site_hot_content()
  remove_already_liked_content()
  refresh_guess_items_and_unread_count()
  put_dislike_button()
  put_expand_note_button()

dislike_init()
dislike_refresh_all()

$("div.guess-more").delegate "a", "click", () ->
  setTimeout(dislike_refresh_all, refresh_interval)
  setTimeout(dislike_refresh_all, refresh_interval * 5)
