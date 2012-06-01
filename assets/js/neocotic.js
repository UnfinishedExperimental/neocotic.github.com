$(function() {

  var $window = $(window)
    , neocotic = $.extend(true, {}, {
          comments: {count: false, list: null}
        , sharing: false
      }, window.neocotic);

  // Activate styled tooltips.
  $('[rel=tooltip]').tooltip();

  // Activate Chrome Web Store inline installations.
  var chrome = window.chrome || {};
  if (chrome.app && chrome.webstore) {
    $('.chrome_install_button').on('click.chrome', function(e) {
      var $this = $(this);
      if (!$this.hasClass('chrome_install_button')) {
        $this.off('.chrome');
        return;
      }
      chrome.webstore.install($this.attr('href'), function() {
        $this.toggleClass('chrome_install_button disabled').off('.chrome');
        $this.html($this.html().replace('Install', 'Installed'));
      });
      e.preventDefault();
    });
  }

  // Improve fragment/anchor accuracy.
  function hashPrecision() {
    var container = $('body .container-fluid').first();
    if (container.length && window.location.hash) {
      $window.scrollTop(container.offset().top - 40);
    }
  }

  $window.on('hashchange', hashPrecision);
  hashPrecision();

  // Specify common name required by Disqus.
  if (neocotic.comments.count || neocotic.comments.list) {
    window.disqus_shortname = 'neocotic';
  }

  // Load Disqus comment count script if enabled.
  if (neocotic.comments.count) {
    $.getScript('http://' + window.disqus_shortname + '.disqus.com/count.js');
  }

  // Load Disqus comment listing script if required.
  if (neocotic.comments.list) {
    window.disqus_identifier = neocotic.comments.list.id;
    window.disqus_title = neocotic.comments.list.title;
    window.disqus_url = 'http://neocotic.com' + neocotic.comments.list.id;
    $.getScript('http://' + window.disqus_shortname + '.disqus.com/embed.js');
  }

  // Add ShareThis buttons and then load script if sharing is enabled.
  if (neocotic.sharing) {
    $('.st_container').append(
        '<span class="st_twitter_hcount" displayText="Tweet"></span>'
      , '<span class="st_plusone_hcount" displayText="Google +1"></span>'
      , '<span class="st_facebook_hcount" displayText="Facebook"></span>'
      , '<span class="st_linkedin_hcount" displayText="LinkedIn"></span>'
      , '<span class="st_email_hcount" displayText="Email"></span>'
      , '<span class="st_sharethis_hcount" displayText="Share"></span>'
    );
    window.switchTo5x = true;
    $.getScript('http://w.sharethis.com/button/buttons.js', function() {
      window.stLight.options({
          onhover: false
        , publisher: '22a034ba-ce1f-48fa-b612-d6ca2289060a'
      });
    });
  }

});