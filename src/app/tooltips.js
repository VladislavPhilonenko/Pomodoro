import jQuery from 'jquery';

(function ($) {
  $(document.body).append('<div class="tooltip"></div>');

  $.fn.tooltips = function() {
    $('.tooltip').hide();

    if (window.innerWidth < 992) return null;

    this.mouseenter((event) => {
      const tooltipMessage = event.target.dataset.tooltip;

      $('.tooltip').html(tooltipMessage).show();
    });

    this.mouseleave(() => {
      $('.tooltip').hide();
    });

    this.mousemove((event) => {
      $('.tooltip').css({ top: event.pageY + 40, left: event.pageX - 10 });
    });
    return this;
  };
}(jQuery));
