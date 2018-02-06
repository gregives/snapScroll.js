function SnapScroll(options) {
  var self = this;

  // Default options, extended by provided options.
  options = $.extend({
    arrowKeys: false,
    duration: 600,
    easing: 'swing',
    element: 'html',
    ordered: true,
    scrollBar: true,
    onLeave: function(currentPoint, nextPoint) {},
    onArrive: function(prevPoint, currentPoint) {}
  }, options);

  // Array of snap points within element.
  var snapPoints = $(options.element).find('[data-snap-point]');

  // Sort snap points by attribute.
  if (!options.ordered) {
    function compare(a, b) {
      var aVal = $(a).data('snapPoint');
      var bVal = $(b).data('snapPoint');
      if (aVal < bVal)
        return -1;
      if (aVal > bVal)
        return 1;
      return 0;
    }

    snapPoints.sort(compare);
  }

  // Flag to indicate scrolling state.
  var scrolling = false;

  /**
   * Get scrolling state.
   * @returns {boolean} Returns true if currently scrolling, false if not.
   */
  this.isScrolling = function() {
    return scrolling;
  }

  /**
   * Scroll to the previous snap point.
   */
  this.scrollPrev = function() {
    var currentPoint = self.currentPoint();
    if (currentPoint > 0) {
      self.scrollToPoint(currentPoint - 1);
    }
  }

  /**
   * Scroll to the next snap point.
   */
  this.scrollNext = function() {
    var currentPoint = self.currentPoint();
    if (currentPoint < snapPoints.length - 1) {
      self.scrollToPoint(currentPoint + 1);
    }
  }

  /**
   * Scroll to a given snap point.
   * @param {number} targetPoint - The index of the point to scroll to.
   * @param {Object} newOptions - The (optional) new options.
   */
  this.scrollToPoint = function(targetPoint, newOptions) {
    if (!scrolling) {
      // Set scrolling flag.
      scrolling = true;

      var currentPoint = self.currentPoint();

      // Add new (optional) options.
      newOptions = $.extend({}, options, newOptions);

      // Don't scroll if onLeave returns false.
      if (newOptions.onLeave(currentPoint, targetPoint) === false) {
        scrolling = false;
        return false;
      }

      var elemHeight = $(window).height();
      var boundingRect = $(snapPoints[targetPoint]).get(0).getBoundingClientRect();
      var pointMiddle = (boundingRect.top + boundingRect.bottom) / 2;
      var middleOfElem = elemHeight / 2;
      var scrollTop = $(newOptions.element).scrollTop() + (pointMiddle - middleOfElem);

      // Check bounds
      var scrollHeight = $(newOptions.element).get(0).scrollHeight;
      scrollTop = scrollTop < middleOfElem ? 0 : scrollTop;
      scrollTop = scrollTop > scrollHeight - elemHeight ? scrollHeight - elemHeight : scrollTop;

      // Animate scroll top to point
      $(newOptions.element).animate({
        scrollTop: scrollTop
      }, newOptions.duration, newOptions.easing, function() {
        scrolling = false;
        newOptions.onArrive(currentPoint, targetPoint);
      });
    }
  }

  /**
   * Get the index of the current snap point.
   * @returns {number} The index of the current snap point.
   */
  this.currentPoint = function() {
    var currentPoint = -1;
    var middleOfElem = $(window).height() / 2;

    // Arbitrary large value.
    var minDiff = Math.pow(2, 32) - 1;

    snapPoints.each(function(index) {
      var boundingRect = $(this).get(0).getBoundingClientRect();

      // Find snap point closest to middle of element.
      var pointMiddle = (boundingRect.top + boundingRect.bottom) / 2;
      var currentDiff = Math.abs(pointMiddle - middleOfElem);
      if (currentDiff < minDiff) {
        currentPoint = index;
        minDiff = currentDiff;
      }
    });

    return currentPoint;
  }

  /**
   * Remove event handlers.
   */
  this.disable = function() {
    $(options.element).off('wheel mousewheel DOMMouseScroll');
    $(options.element).off('touchstart');
    $(options.element).off('touchmove');
    $(window).off('keydown');
  }

  /**
   * Bind event handlers.
   */
  this.enable = function() {
    // Detect the change in mouse wheel.
    $(options.element).on('wheel mousewheel DOMMouseScroll', function(event) {
      var e = event.originalEvent;
      var delta = -e.deltaY || e.wheelDelta || -e.detail;
      delta > 0 ? self.scrollPrev() : self.scrollNext();

      event.preventDefault();
    });

    // Touch positions
    var lastY;
    var currentY;

    // Record the position of first touch.
    $(options.element).on('touchstart', function(event) {
      currentY = event.originalEvent.touches[0].clientY;

      lastY = currentY;
      event.preventDefault();
    });

    // Detect the change in touch position.
    $(options.element).on('touchmove', function(event) {
      currentY = event.originalEvent.touches[0].clientY;
      var delta = currentY - lastY;
      delta > 0 ? self.scrollPrev() : self.scrollNext();

      lastY = currentY;
      event.preventDefault();
    });

    if (options.arrowKeys) {
      // Detect arrow key presses.
      $(window).on('keydown', function(event) {
        var key = event.which;
        if (key === 38) {
          self.scrollPrev();
        } else if (key === 40) {
          self.scrollNext();
        }
      });
    }
  }

  // Check options.
  if ($.easing.hasOwnProperty(options.easing)) {
    this.enable();

    // Enable scrolling of element.
    if (options.scrollBar) {
      $(options.element).css('overflow-y', 'scroll');
    } else {
      // Hide scroll bar.
      $(options.element).css('overflow-y', 'hidden');
    }
  } else {
    // Throw error if easing function not found.
    throw new Error("Easing function not found. If using an easing function other than 'swing' or 'linear', you must include the jquery.easing.js file. See https://github.com/gregives/snapScroll.js#usage" );
  }

}
