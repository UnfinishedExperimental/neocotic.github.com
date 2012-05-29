(function() {

  var QUERY_PARAM = 'q';

  function parseParamsFromUrl() {
    var search = window.location.search.substr(1)
      , parts = search.split('&');
    for (var i = 0; i < parts.length; i++) {
      var keyvaluepair = parts[i].split('=');
      if (decodeURIComponent(keyvaluepair[0]) === QUERY_PARAM) {
        return decodeURIComponent(keyvaluepair[1].replace(/\+/g, ' '));
      }
    }
    return '';
  }

  var customSearchControl
    , queryFromUrl = parseParamsFromUrl();

  google.load('search', '1', {language : 'en'});

  google.setOnLoadCallback(function() {
    customSearchControl = new google.search.CustomSearchControl(
      '010241032241406631661:WMX2654048');
    customSearchControl.setResultSetSize(
      google.search.Search.LARGE_RESULTSET);
    var options = new google.search.DrawOptions();
    options.setAutoComplete(true);
    options.enableSearchResultsOnly();
    customSearchControl.draw('cse', options);
    if (queryFromUrl) customSearchControl.execute(queryFromUrl);
  }, true);

  $(function() {

    var form = $('#cse-input')
      , input = form.find('input[name="' + QUERY_PARAM + '"]').val(
          queryFromUrl)
      , loaded = false;

    if (queryFromUrl) $('#cse > .progress').show();

    $(window).on('popstate', function() {
      queryFromUrl = parseParamsFromUrl();
      input.val(queryFromUrl);
      if (!loaded) {
        loaded = true;
      } else if (customSearchControl) {
        if (queryFromUrl) {
          customSearchControl.execute(queryFromUrl);
        } else {
          customSearchControl.clearAllResults();
        }
      }
    });

    form.on('submit', function() {
      if (customSearchControl) {
        var queryFromInput = input.val();
        if (queryFromInput) {
          customSearchControl.execute(queryFromInput);
        } else {
          customSearchControl.clearAllResults();
        }
        if ($.isFunction(window.history.pushState)) {
          window.history.pushState({}, null, '?q=' + queryFromInput);
        }
        return false;
      }
    });

  });

}());