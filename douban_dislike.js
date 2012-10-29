var refresh_interval = 850;

var remove_site_hot_content = function(){
    $("div.guess-item div.source:contains('热点')").parent().parent().parent().remove();
}

var remove_already_liked_content = function(){
    $("div.guess-item div.ft span.fav-btn a.selected").parent().parent().parent().remove();
    //book, movie, music
    $("div.guess-item div.ft span.subject-btn a.selected").parent().parent().parent().remove();

}

var refresh_guess_items_and_unread_count = function(){

    //since hot_content has been removed, we can get user_id from guess_item;
    guess_item = $("div.guess-item:first")

    var get_user_id = function(){
	try{
	    user_id = guess_item.attr("id").split(":")[0];
	    localStorage.douban_dislike_user_id = user_id;
	}
	catch(err){
	    user_id = localStorage.douban_dislike_user_id;
	}
	return user_id;
    }

    var user_id = get_user_id();
    if(!user_id){
	return false;
    }

    var refresh_unread_count = function(){
	var douban_home_link = $("div.site-nav-items ul li:eq(0) a");
	var unread_count = $("div.guess-item").length;
	if (unread_count > 0){
	    douban_home_link.text("首页(" + unread_count + ")");
	}
    }

    //filtered out disliked items
    $.ajax({
	type: "GET",
	url: "http://50.116.13.151/dislikes",
	data: { user_id: user_id }
    }).done(function(received) {
	dislikes = received['dislikes'];
	for(dislike_idx in dislikes){
	    dislike_unique_id = dislikes[dislike_idx];
	    $("div.guess-item[unique_id='" + dislike_unique_id + "']").remove();
	    refresh_unread_count();
	}

    });

}

var put_dislike_button = function() {
    $("div.guess-item div.ft:not(:has(span.dislike-btn))").append('<span class="usr-btn fav-btn dislike-btn"><a href>不喜欢</a></span>');

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
	if(!user_id){
	    return false;
	}

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
		url: "http://50.116.13.151",
		data: { kind: kind, target_id: id, user_id: user_id }
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
    $("div.guess-item div.ft:not(:has(span.dismiss-btn))").append('<span class="usr-btn dismiss-btn"><a href>隐藏</a></span>');

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

var make_like_button_dismiss_guess_item = function() {
$("div.guess-item div.ft:not(:has(span.dislike-btn)) span.fav-btn['data-tid']").delegate("a", "click", function() {
    var guess_item_dismiss = function(){
	$(this).parent().parent().parent().remove();
    }
    setTimeout(guess_item_dismiss, refresh_interval * 5);
});
}

var dislike_refresh_all = function(){
remove_site_hot_content();
remove_already_liked_content();
refresh_guess_items_and_unread_count();
make_like_button_dismiss_guess_item();
put_dislike_button();
//put_dismiss_buttion();
}

dislike_refresh_all();

//make load_more_guess with douban-dislike logic.
$("div.guess-more").delegate("a", "click", function() {
    setTimeout(dislike_refresh_all, refresh_interval);
    setTimeout(dislike_refresh_all, refresh_interval * 5); //refresh in case the request failed.
});
