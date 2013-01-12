(function() {
  var add_site_hot_content_options, dislike_init, dislike_refresh_all, hide_site_hot_content, put_dislike_button, put_expand_note_button, refresh_guess_items_and_unread_count, refresh_interval, refresh_site_hot_content, refresh_unread_count, remove_already_liked_content, show_site_hot_content;

  refresh_interval = 850;

  hide_site_hot_content = function() {
    return $("div.guess-item:has(div.source:contains('热点'))").hide();
  };

  show_site_hot_content = function() {
    return $("div.guess-item:has(div.source:contains('热点'))").show();
  };

  add_site_hot_content_options = function() {
    var is_show_hot_site_content;
    is_show_hot_site_content = localStorage.getItem('option_show_site_hot_content') === "true";
    $("div.guess3-setting div.hd:not(:has(input#show_site_hot_content))").prepend("<input id=show_site_hot_content type=checkbox><label for=show_site_hot_content>显示全站热点</label>");
    $("input#show_site_hot_content").attr("checked", is_show_hot_site_content);
    return $("input#show_site_hot_content").click(function() {
      var shsc_value;
      shsc_value = $(this).attr("checked") === "checked";
      localStorage.setItem('option_show_site_hot_content', shsc_value);
      if (shsc_value) {
        return show_site_hot_content();
      } else {
        return hide_site_hot_content();
      }
    });
  };

  refresh_site_hot_content = function() {
    var shsc_value;
    shsc_value = $("input#show_site_hot_content").attr("checked") === "checked";
    if (shsc_value) {
      return show_site_hot_content();
    } else {
      return hide_site_hot_content();
    }
  };

  remove_already_liked_content = function() {
    $("div.guess-item:has(div.ft span.fav-btn a.selected)").remove();
    $("div.guess-item:has(div.ft span.subject-btn a.selected)").remove();
    $("div.guess-item:has(div.ft span.online-event-btn a.selected)").remove();
    return $("div.guess-item:has(div.ft span.event-btn a.selected)").remove();
  };

  refresh_unread_count = function() {
    var douban_home_link, unread_count;
    douban_home_link = $("div.site-nav-items ul li:eq(0) a");
    unread_count = $("div.guess-item").length;
    if (unread_count > 0) return douban_home_link.text("豆瓣(" + unread_count + ")");
  };

  refresh_guess_items_and_unread_count = function() {
    var get_user_id, guess_item, user_id,
      _this = this;
    guess_item = $("div.guess-item:first");
    get_user_id = function() {
      var user_id;
      user_id = $("div.guess-item[id*=':']:not([id^='other']):first").attr("id").split(":")[0];
      localStorage.douban_dislike_user_id = user_id;
      return user_id;
    };
    user_id = get_user_id();
    if (!user_id) return false;
    return $.ajax({
      type: "GET",
      url: "http://50.116.13.151/douban_dislikes/dislikes",
      data: {
        user_id: user_id
      }
    }).done(function(received) {
      var dislike, dislikes, _i, _len;
      dislikes = received['dislikes'];
      for (_i = 0, _len = dislikes.length; _i < _len; _i++) {
        dislike = dislikes[_i];
        $("div.guess-item[unique_id='" + dislike + "']").remove();
      }
      return refresh_unread_count();
    });
  };

  put_dislike_button = function() {
    $("div.guess-item div.ft:not(:has(span.dislike-btn))").append('<span class="usr-btn fav-btn dislike-btn"><a href>不喜欢</a></span>');
    return $("div.guess-item").delegate("div.ft span.dislike-btn a", "click", function(evt) {
      var get_kind_and_id, get_user_id, guess_item, id, kind, save_dislike, user_id, _ref,
        _this = this;
      guess_item = $(this).parent().parent().parent();
      get_user_id = function() {
        var user_id;
        return user_id = $("div.guess-item[id*=':']:not([id^='other']):first").attr("id").split(":")[0];
      };
      get_kind_and_id = function() {
        return guess_item.attr("unique_id").split(":");
      };
      _ref = get_kind_and_id(), kind = _ref[0], id = _ref[1];
      user_id = get_user_id();
      if (!user_id) return false;
      save_dislike = function(user_id, kind, id) {};
      $.ajax({
        type: "GET",
        url: "http://50.116.13.151/douban_dislikes",
        data: {
          kind: kind,
          target_id: id,
          user_id: user_id
        }
      }).done(function(msg) {
        guess_item.remove();
        return refresh_unread_count();
      });
      save_dislike(user_id, kind, id);
      return event.preventDefault();
    });
  };

  put_expand_note_button = function() {
    $("div.guess-item[unique_id^=1015] div.source:not(:has(span.expand-note-btn))").append('<span class="usr-btn expand-note-btn"><a href>展开</a></span>');
    return $("div.guess-item[unique_id^=1015] div.source span.expand-note-btn a").click(function() {
      var guess_item, guess_item_note_id, guess_item_note_kind, _ref;
      guess_item = $(this).parent().parent().parent().parent();
      _ref = $(guess_item[0]).attr("unique_id").split(":"), guess_item_note_kind = _ref[0], guess_item_note_id = _ref[1];
      $.ajax({
        type: "GET",
        url: "http://www.douban.com/note/" + guess_item_note_id + "/",
        headers: {
          "Content-Type": "text/html"
        }
      }).done(function(received_html) {
        var note_context;
        note_context = $("div.note:last", received_html);
        $("div.content div.desc", guess_item).html(note_context);
        return $("div.source span.loading", guess_item).remove();
      });
      $(this).parent().html('<span class="loading">加载中……</span>');
      return event.preventDefault();
    });
  };

  dislike_init = function() {
    return add_site_hot_content_options();
  };

  dislike_refresh_all = function() {
    refresh_site_hot_content();
    remove_already_liked_content();
    refresh_guess_items_and_unread_count();
    put_dislike_button();
    return put_expand_note_button();
  };

  dislike_init();

  dislike_refresh_all();

  $("div.guess-more").delegate("a", "click", function() {
    setTimeout(dislike_refresh_all, refresh_interval);
    return setTimeout(dislike_refresh_all, refresh_interval * 5);
  });

}).call(this);
