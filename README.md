# snapScroll.js

An easy to use library to enable snap scrolling on your website. Simply choose which elements you want to snap to.

<img src="./example/images/preview.gif" width="900">

## Compatibility

**All modern browsers are supported.** Browser compatibility:

* **Chrome**: &ge;  26

* **Firefox**: &ge; 21

* **Edge**: &ge; 14*

* **Opera**: &ge; 15

* **Safari**: &ge; 6.2

* **Internet Explorer**: Not supported

\* There is a bug on Edge when using a precision touchpad.

[<img src="./example/images/browserstack.png" width="300">](http://www.browserstack.com/)

Browser compatibility has been tested using [BrowserStack](http://www.browserstack.com/), huge thanks to them for supporting the project!

## How To Use

You will need to include:

* [jQuery library](https://jquery.com) (1.7 minimum)
* The JavaScript file `jquery.snapScroll.js`, or the minified version `jquery.snapScroll.min.js`

Optionally:

* The minified JavaScript file `jquery.easing.min.js` for additional easing functions (see `easing` [option](#options))

### Including Files

For example,

```html
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" charset="utf-8"></script>

<!-- snapScroll JavaScript file -->
<script src="jquery.snapScroll.min.js" charset="utf-8"></script>

<!-- Additional easing file (optional) -->
<script src="jquery.easing.min.js" charset="utf-8"></script>
```

### HTML Structure

All you need to do is add the `data-snap-point` attribute to the elements you wish to scroll to. For example,

```html
<body>
  <div data-scroll-point></div>
  <section>
    <article data-scroll-point></article>
    <article data-scroll-point>
      <p></p>
    </article>
    <article></article>
    <article data-scroll-point></article>
  </section>
  ...
```

It is also possible to scroll to points in a different order than in the markup. Just set the `ordered` option to `false` and set the `data-snap-point` attribute to the point index:

```html
<body>
  <div data-scroll-point="1"></div>
  <section>
    <article data-scroll-point="4"></article>
    <article data-scroll-point="2">
      <p></p>
    </article>
    <article></article>
    <article data-scroll-point="3"></article>
  </section>
  ...
```

**Note**: the indices can start at any value, and do not need to be consecutive values. **Be cautious** when using unordered snap points, the user experience may be terrible.

### Initialisation

All you need to do is create a `SnapScroll` object inside a `$(document).ready` function:

```javascript
$(document).ready(function() {
  var ss = new SnapScroll();
});
```

Optionally, you can pass the constructor custom options. A constructor with multiple options could look like so:

```javascript
$(document).ready(function() {
  var ss = new SnapScroll({
    // Options
    arrowKeys: false,
    duration: 600,
    easing: 'swing',
    element: 'html',
    ordered: true,
    scrollBar: true,

    // Callbacks
    onLeave: function(currentPoint, targetPoint) {},
    onArrive: function(currentPoint, targetPoint) {}
  });
});
```

## Options

* `arrowKeys`: (default `false`) When set to `true`, keyboard arrow keys can be used to navigate between scroll points. If set to `true` for more than one element, will scroll both.

* `duration`: (default `600`) The duration in milliseconds of the animation between scroll points.

* `easing`: (default `'swing'`) The transition effect of the scroll animation. The easing functions included with jQuery are:

    * `swing`
    * `linear`

    If you have included the `jquery.easing.min.js` file (see [Including Files](#including-files)), then you can use [additional easing functions](http://api.jqueryui.com/easings/).

* `element`: (default `'html'`) The element to scroll; usually the whole page.

* `ordered`: (default `true`) Defines if the snap points should be scrolled to in their markup order, or if a separate order has been specified.

* `scrollBar`: (default `true`) When set to `false`, the scroll bar of the element will be hidden.

## Callbacks

* `onLeave(currentPoint, nextPoint)`: Called when leaving a scroll point i.e. when the animation is starting.

    * `currentPoint`: Index of the current scroll point.
    * `targetPoint`: Index of the target/destination scroll point.

    Returning `false` from the `onLeave` function will cancel the scroll before it takes place.

* `onArrive(prevPoint, currentPoint)`: Called when arriving at a scroll point i.e. when the animation has finished.

    * `prevPoint`: Index of the previous scroll point.
    * `currentPoint`: Index of the new current scroll point.

## Methods

All methods should be called on the SnapScroll object.

* `scrollPrev()`: Scroll to the previous scroll point.

* `scrollNext()`: Scroll to the next scroll point.

* `scrollToPoint(targetPoint, newOptions)`: Scroll to the given scroll point.

    * `targetPoint`: Index of the target scroll point.
    * `newOptions`: New options to override current options (**optional**).

* `currentPoint()`: Gets the index of the nearest scroll point.

* `enable()`: Enable scroll points within element (called automatically when SnapScroll object is created).

* `disable()`: Disable scroll points within element.

* `isScrolling()`: Returns `true` if currently scrolling, `false` if not.

For example,

```javascript
$(document).ready(function() {
  var ss = new SnapScroll();

  ss.scrollToPoint(3, {
    duration: 1200,
    easing: 'easeOutBounce'
  });
  ss.disable();
});
```
