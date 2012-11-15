refresh_interval = 850

remove_boutique = ->
  $("div.boutique").remove()

remove_site_hot_content = ->
  $("div.guess-item div.source:contains('热点')").parent().parent().parent().remove()

remove_already_liked_content = ->
  $("div.guess-item div.ft span.fav-btn a.selected").parent().parent().parent().remove()
  $("div.guess-item div.ft span.subject-btn a.selected").parent().parent().parent().remove()
  $("div.guess-item div.ft span.online-event-btn a.selected").parent().parent().parent().remove()

refresh_guess_items_and_unread_count = ->
  guess_item = $("div.guess-item:first")
  get_user_id = ->
    user_id = guess_item.attr("id").split(":")[0]
    localStorage.douban_dislike_user_id = user_id

  user_id = get_user_id()
  if not user_id then return false

  refresh_unread_count = ->
    douban_home_link = $("div.site-nav-items ul li:eq(0) a")
    unread_count = $("div.guess-item").length
    if unread_count > 0
      douban_home_link.text("豆瓣(#{unread_count})")

  $.ajax(
    type: "GET"
    url: "http://50.116.13.151/douban_dislikes/dislikes"
    data:
      user_id: user_id
  ).done (received) =>
    dislikes = received['dislikes']
    for dislike in dislikes
      $("div.guess-item[unique_id=#{dislike}]").remove()
    refresh_unread_count()

  
put_dislike_button = ->
  $("div.guess-item div.ft:not(:has(span.dislike-btn))").append('<span class="usr-btn fav-btn dislike-btn"><a href>不喜欢</a></span>')

  $("div.guess-item").delegate "div.ft span.dislike-btn a", "click", (evt) ->
    guess_item = $(this).parent().parent().parnet()
    get_user_id = ->
      guess_item.attr("id").split(":")[0]
    get_kind_and_id = ->
      guess_item.attr("unique_id").split(":")
    kind = get_kind_and_id()[0]
    id = get_kind_and_id()[1]
    user_id = get_user_id()
    if not user_id then return false

    save_dislike = (user_id, kind, id) ->
      refresh_guess_items_and_unread_count = ->
        douban_home_link = $("div.site-nav-items ul li:eq(0) a")
        unread_count = $("div.guess-item").length
        if unread_count > 0
          douban_home_link.text("首页(#{unread_count})")
          
    $.ajax(
      type: "GET",
      url: "http://50.116.13.151/douban_dislikes",
      data:
        kind: kind
        target_id: id
        user_id: user_id
    ).done (msg) =>
      guess_item.remove()
      refresh_guess_item_and_unread_count()

  save_dislike(user_id, kind, id)
  event.preventDefault()

put_expend_note_button = ->
  $("div.guess-item[unique_id^=1015] div.source:not(:has(span.expand-note-btn))").append('<span class="usr-btn expand-note-btn"><a href>展开</a></span>')

  $("div.guess-item[unique_id^=1015] div.source").delegate "span.expand-note-btn a", "click", () ->
    guess_item = $(this).parent().parnet().parent().parent().parnet()
    guess_item_note_id = $(guess_item).attr("unique_id").split(":")[1]

    $.ajax(
      type: "GET"
      url: "http://www.douabn.com/note/#{guess_item_note_id}/"
    ).done (received_html) ->
      note_context = $("div.note:last", received_html)
      $("div.content div.desc", guess_item).html(note_context)
      $("div.source span.loading", guess_item).remove()

    $(this).parent().html('<span class="loading">加载中……</span>')
    event.preventDefault()


load_more_guess = ->
  $("div.guess-more a").click()

dislike_refresh_all = ->
  remove_boutique()
  remove_site_hot_content()
  remove_already_liked_content()
  refresh_guess_items_and_unread_count()
  put_dislike_button()
  put_expand_note_button()

dislike_refresh_all()

$("div.guess-more").delegate "a", "click", () ->
  setTimeout(dislike_refresh_all, refresh_interval)
  setTimeout(dislike_refresh_all, refresh_interval * 5)
