(function() {
  $(document).ready(function(){
    $('.feedback-thumbs-up, .feedback-thumbs-down').on('click', function() {
      event.preventDefault();
      $('.feedback-thumbs-up, .feedback-thumbs-down').off('click');

      // $('.active').removeClass('active');
      $(this).addClass('active');
      var eventAction = $(this).hasClass('feedback-thumbs-up') ? 'like' : 'dislike';
      $('.feedback-thumbs-up, .feedback-thumbs-down').css({'cursor': 'initial'});
      $('.feedback-thumbs-up, .feedback-thumbs-down').removeClass('feedback-active');

      ga('send', {
        hitType: 'event',
        eventCategory: 'Post',
        eventAction: eventAction,
        eventLabel: document.title
      });
      $('.feedback-thumbs-up, .feedback-thumbs-down').css({'cursor': 'initial'});

    });
  });



})();
