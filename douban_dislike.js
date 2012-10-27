var remove_site_hot_content = function(){
    $("div.guess-item div.source:contains('热点')").parent().parent().parent().remove();
}

var refresh_guess_items_and_unread_count = function(){
    var douban_home_link = $("div.site-nav-items ul li:eq(0) a");
    var unread_count = $("div.guess-item").length;
    if (unread_count > 0){
	douban_home_link.text("首页(" + unread_count + ")");
    }
}

var put_dislike_button = function() {
    $("div.guess-item div.ft").append('<span class="usr-btn fav-btn dislike-btn"><a href>不喜欢</a></span>');

    $("div.guess-item").delegate("div.ft span.dislike-btn a", "click", function() {

	var guess_item = $(this).parent().parent().parent();

	var get_user_id = function(){
	    return guess_item.attr("id").split(":")[0];
	}
	
	var get_kind_and_id = function(){
	    return guess_item.attr("unique_id").split(":");
	}

	var kind = get_kind_and_id()[0];
	var id = get_kind_and_id()[1];
	var user_id = get_user_id();
	console.log(kind, id, user_id);


	var save_dislike = function(user_id, kind, id){

	    var refresh_guess_items_and_unread_count = function(){
		var douban_home_link = $("div.site-nav-items ul li:eq(0) a");
		var unread_count = $("div.guess-item").length;
		if (unread_count > 0){
		    douban_home_link.text("首页(" + unread_count + ")");
		}
	    }

	    $.ajax({
		type: "GET",
		url: "http://127.0.0.1:5000",
		data: { kind: kind, id: id, user_id: user_id }
	    }).done(function(msg) {
		guess_item.remove();
		refresh_guess_items_and_unread_count();
	    });
	}
	
	save_dislike(user_id, kind, id);
	event.preventDefault();
    });


}

var put_dismiss_buttion = function() {
    $("div.guess-item div.ft").append('<span class="usr-btn dismiss-btn"><a href>隐藏</a></span>');

    $("div.guess-item").delegate("div.ft span.dismiss-btn a", "click", function() {
	var guess_item = $(this).parent().parent().parent();
	guess_item.fadeOut().remove(); //div.guess-item

	var refresh_guess_items_and_unread_count = function(){
	    var douban_home_link = $("div.site-nav-items ul li:eq(0) a");
	    var unread_count = $("div.guess-item").length;
	    douban_home_link.text("首页(" + unread_count + ")");
	}
	refresh_guess_items_and_unread_count();
	event.preventDefault();
    });

}

var load_more_guess = function() {
    $("div.guess-more a").click();
}

remove_site_hot_content();
refresh_guess_items_and_unread_count();
put_dislike_button();
put_dismiss_buttion();
