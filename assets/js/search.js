(function() {

  var QUERY_PARAM = 'q';

  function parseParamsFromUrl() {
    var params = {}
      , parts = window.location.search.substr(1).split('\x26');
    for (var i = 0; i < parts.length; i++) {
      var keyValuePair = parts[i].split('=')
        , key = decodeURIComponent(keyValuePair[0]);
      params[key] = keyValuePair[1]
        ? decodeURIComponent(keyValuePair[1].replace(/\+/g, ' '))
        : keyValuePair[1];
    }
    return params;
  }

  var customSearchControl
    , queryFromUrl = parseParamsFromUrl()[QUERY_PARAM];

  google.load('search', '1', {language : 'en'});

  google.setOnLoadCallback(function() {
    customSearchControl = new google.search.CustomSearchControl(
      '010241032241406631661:WMX2654048', {
        googleAnalyticsOptions: {
            categoryParameter: ''
          , queryParameter: QUERY_PARAM
        }
      });
    customSearchControl.setResultSetSize(
      google.search.Search.FILTERED_CSE_RESULTSET);
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
      queryFromUrl = parseParamsFromUrl()[QUERY_PARAM];
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