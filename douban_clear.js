(function() {
  var remove_boutique;

  remove_boutique = function() {
    $("div.boutique").remove();
    return $("a[title=豆瓣小组手机客户端]").remove();
  };

  remove_boutique();

}).call(this);
