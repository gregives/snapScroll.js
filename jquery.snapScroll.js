/**
 * snapScroll
 * https://github.com/gregives/snapScroll.js
 * @author Greg Ives
 * @license MIT License
 */
;(function ($, window, document) {
  /**
   * Scrolling controller.
   * @param elem - The element to scroll.
   * @param options - The scrolling options.
   */
  function SnapScroll (elem, options) {
    this.elem = elem[0]
    this.options = options
  }

  SnapScroll.prototype = {
    // Default options.
    defaults: {
      arrowKeys: false,
      duration: 600,
      easing: 'swing',
      ordered: true,
      scrollBar: true,
      onLeave: function (currentPoint, nextPoint) {},
      onArrive: function (prevPoint, currentPoint) {}
    },

    // Flag to indicate scrolling state.
    scrolling: false,

    /**
     * Initialise snapScroll on the specified element.
     */
    init: function () {
      // Extend default options
      this.config = $.extend({}, this.defaults, this.options)

      // Get snap points.
      this.snapPoints = $(this.elem).find('[data-snap-point]')

      // If unordered, sort snap points by attribute.
      if (!this.config.ordered) {
        var compare = function (a, b) {
          var aVal = $(a).data('snapPoint')
          var bVal = $(b).data('snapPoint')
          if (aVal < bVal) {
            return -1
          }
          if (aVal > bVal) {
            return 1
          }
          return 0
        }

        this.snapPoints.sort(compare)
      }

      // Enable scrolling of element.
      if (this.config.scrollBar) {
        $(this.elem).css('overflow-y', 'scroll')
      } else {
        // Hide scroll bar.
        $(this.elem).css('overflow-y', 'hidden')
      }

      this.enable()
      return this
    },

    /**
     * Scroll to the previous snap point.
     */
    scrollPrev: function () {
      var currentPoint = this.currentPoint()
      if (currentPoint > 0) {
        this.scrollToPoint(currentPoint - 1)
      }
    },

    /**
     * Scroll to the next snap point.
     */
    scrollNext: function () {
      var currentPoint = this.currentPoint()
      if (currentPoint < this.snapPoints.length - 1) {
        this.scrollToPoint(currentPoint + 1)
      }
    },

    /**
     * Get the index of the current snap point.
     * @returns {number} The index of the current snap point.
     */
    currentPoint: function () {
      var currentPoint = -1
      var middleOfElem = $(this.elem).height() / 2

      // Arbitrary large value.
      var minDiff = Infinity

      this.snapPoints.each(function (index) {
        var boundingRect = this.getBoundingClientRect()

        // Find snap point closest to middle of element.
        var pointMiddle = (boundingRect.top + boundingRect.bottom) / 2
        var currentDiff = Math.abs(pointMiddle - middleOfElem)
        if (currentDiff < minDiff) {
          currentPoint = index
          minDiff = currentDiff
        }
      })

      return currentPoint
    },

    /**
     * Scroll to a given snap point.
     * @param {number} targetPoint - The index of the point to scroll to.
     * @param {Object} newOptions - The (optional) new options.
     */
    scrollToPoint: function (targetPoint, newOptions) {
      if (!this.scrolling) {
        var currentPoint = this.currentPoint()

        // Add new (optional) options.
        newOptions = $.extend({}, this.config, newOptions, this.config.onLeave(currentPoint, targetPoint))

        // Don't scroll if onLeave cancels.
        if (newOptions.cancel) {
          return false
        }

        // Set scrolling flag.
        this.scrolling = true

        var elemHeight = $(this.elem).height()
        var boundingRect = this.snapPoints[targetPoint].getBoundingClientRect()
        var pointMiddle = (boundingRect.top + boundingRect.bottom) / 2
        var middleOfElem = elemHeight / 2
        var currentScrollTop = $(this.elem).scrollTop()
        var scrollTop = currentScrollTop + (pointMiddle - middleOfElem)

        // Check bounds of scrolling element.
        var scrollHeight = this.elem === window ? document.scrollHeight : this.elem.scrollHeight
        scrollTop = scrollTop < middleOfElem ? 0 : scrollTop
        scrollTop = scrollTop > scrollHeight - elemHeight ? scrollHeight - elemHeight : scrollTop

        var scrollElem = this.elem === window ? 'html, body' : this.elem

        // Reference to SnapScroll.
        var self = this

        // Animate scroll top to point.
        $(scrollElem).animate({
          scrollTop: scrollTop
        }, newOptions.duration, newOptions.easing, function () {
          self.scrolling = false
          newOptions.onArrive(currentPoint, targetPoint)
        })
      }
    },

    /**
     * Bind event handlers to the element.
     */
    enable: function () {
      // Reference to SnapScroll.
      var self = this

      // Detect the change in mouse wheel.
      $(this.elem).on('wheel mousewheel DOMMouseScroll', function (e) {
        var oE = e.originalEvent
        var delta = -oE.deltaY || oE.wheelDelta || -oE.detail
        delta > 0 ? self.scrollPrev() : self.scrollNext()

        e.preventDefault()
      })

      // Touch positions
      var lastY
      var currentY

      // Record the position of first touch.
      $(this.elem).on('touchstart', function (e) {
        currentY = e.originalEvent.touches[0].clientY

        lastY = currentY
      })

      // Detect the change in touch position.
      $(this.elem).on('touchmove', function (e) {
        currentY = e.originalEvent.touches[0].clientY
        var delta = currentY - lastY
        delta > 0 ? self.scrollPrev() : self.scrollNext()

        lastY = currentY
        e.preventDefault()
      })

      if (this.config) {
        // Detect arrow key presses.
        $(window).on('keydown', function (e) {
          var key = e.which
          if (key === 38) {
            self.scrollPrev()
          } else if (key === 40) {
            self.scrollNext()
          }
        })
      }
    },

    /**
     * Unbind event handlers from the element.
     */
    disable: function () {
      $(this.elem).off('wheel mousewheel DOMMouseScroll')
      $(this.elem).off('touchstart')
      $(this.elem).off('touchmove')
      $(window).off('keydown')
    }
  }

  // jQuery plugin function.
  $.fn.snapScroll = function (options) {
    return new SnapScroll(this, options).init()
  }
})(jQuery, window, document)
