# snapScroll.js

An easy to use library to snap to elements when scrolling a website.

## Usage

You will need to include:

* [jQuery library](https://jquery.com) (1.7 minimum)
* The JavaScript file `jquery.snapScroll.js`, or the minified version `jquery.snapScroll.min.js`

Optionally:

* [jQuery UI](https://jqueryui.com/) for additional easing functions (see `easing` [option](#options))

### Including Files

For example,

```javascript
// jQuery library
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" charset="utf-8"></script>

// jQuery UI (optional)
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" charset="utf-8"></script>

// snapScroll JavaScript file
<script src="jquery.snapScroll.min.js" charset="utf-8"></script>
```

### HTML Structure

All you need to do is add the `data-scrollPoint` attribute to the elements you wish to scroll to. For example,

```html
<body>
  <div data-scrollPoint></div>
  <section>
    <article data-scrollPoint></article>
    <article data-scrollPoint>
      <p></p>
    </article>
    <article></article>
    <article data-scrollPoint></article>
  </section>
  ...
```

### Initialisation

All you need to do is create a `SnapScroll` object inside a `$(document).ready` function:

```javascript
$(document).ready(function() {
  var ss = new SnapScroll();
})
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

    // Callbacks
    onLeave: function(currentPoint, targetPoint) {},
    onArrive: function(currentPoint, targetPoint) {}
  });
})
```

## Options

* `arrowKeys`: (default `false`) When set to `true`, keyboard arrow keys can be used to navigate between scroll points. If set to `true` for more than one element, will scroll both.

* `duration`: (default `600`) The duration in milliseconds of the animation between scroll points.

* `easing`: (default `'swing'`) The transition effect of the scroll animation. The easing functions included with jQuery are:

    * `swing`
    * `linear`

    If you have included the jQuery UI library (see [Including Files](#including-files)) then you can use [additional easing functions](http://api.jqueryui.com/easings/).

* `element`: (default `'html'`) The element to scroll; usually the whole page.

## Callbacks

* `onLeave(currentPoint, nextPoint)`: Called when leaving a scroll point i.e. when the animation is starting.

    * `currentPoint`: Index of the current scroll point.
    * `targetPoint`: Index of the target/destination scroll point.

* `onArrive(prevPoint, currentPoint)`: Called when arriving at a scroll point i.e. when the animation has finished.

    * `prevPoint`: Index of the previous scroll point.
    * `currentPoint`: Index of the new current scroll point.

## Methods

All methods should be called on the SnapScroll object.

* `scrollPrev()`: Scroll to the previous scroll point.
* `scrollNext()`: Scroll to the next scroll point.
* `scrollToPoint(targetPoint)`: Scroll to the given scroll point.
    * `targetPoint`: Index of the target scroll point.
* `currentPoint()`: Gets the index of the current (nearest) scroll point.
* `enable()`: Enable scroll points within element (called automatically when SnapScroll object is created).
* `disable()`: Disable scroll points within element.

For example,

```javascript
$(document).ready(function() {
  var ss = new SnapScroll();

  ss.scrollToPoint(3);
  ss.disable();
})
```
