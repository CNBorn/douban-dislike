(function() {
  var remove_boutique;

  tweak_for_new_nav = function() {
    $("#db-global-nav").css({
      "width": "960px",
      "margin": "0 auto",
      "background-color": "white"
    });
    $(".global-nav a:active, .global-nav a:link, .global-nav a:visited").css({
      "color": "#072"
    });
    return $('.global-nav a').hover(function() {
      return $(this).css({
        'color': "white",
        'background-color': '#072'
      });
    }, function() {
      return $(this).css({
        'background-color': '',
        'color': "#072"
      });
    });
  };

  remove_boutique = function() {
    $("div.boutique").remove();
    $("div#dale_update_top_right").remove();
    $("div#dale_homepage_login_top_right").remove();
  };

  remove_boutique();
  tweak_for_new_nav();

}).call(this);
