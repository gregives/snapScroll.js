# snapScroll.js

An easy-to-use, lightweight jQuery plugin to enable snap scrolling on your website. Simply choose which elements you want to snap to.

## 1. Getting Started

#### 1.1. Including Files

You will need to include:

* [jQuery library](https://jquery.com) (1.7 minimum)
* The JavaScript file `jquery.snapScroll.js`, or the minified version `jquery.snapScroll.min.js`

Optionally:

* The minified JavaScript file `jquery.easing.min.js` for additional easing functions (see `easing` [option](#21-options))

Include these files just before your closing `</body>` tag.

```html
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" charset="utf-8"></script>

<!-- snapScroll JavaScript file -->
<script src="jquery.snapScroll.min.js" charset="utf-8"></script>

<!-- Additional easing file (optional) -->
<script src="jquery.easing.min.js" charset="utf-8"></script>
```

#### 1.2. HTML Structure

All you need to do is add the `data-snap-point` attribute to the elements you wish to scroll to. For example,

```html
<body>
  <div data-snap-point></div>
  <section>
    <article data-snap-point></article>
    <article data-snap-point>
      <p></p>
    </article>
    <article></article>
    <article data-snap-point></article>
  </section>
  ...
```

It is also possible to scroll to points in a different order than in the markup. Just set the `ordered` option to `false` and set the `data-snap-point` attribute to the point index:

```html
<body>
  <div data-snap-point="1"></div>
  <section>
    <article data-snap-point="4"></article>
    <article data-snap-point="2">
      <p></p>
    </article>
    <article></article>
    <article data-snap-point="3"></article>
  </section>
  ...
```

**Note**: to avoid unexpected results, indices should be zero-indexed and hold consecutive values. **Be cautious** when using unordered snap points, the user experience may be terrible.

#### 1.3. Initialisation

Inside a `$(document).ready` function, call the `snapScroll` function on a jQuery-wrapped element. To scroll the whole page (the most common case), the only code you need is

```javascript
$(document).ready(function () {
  $(window).snapScroll()
})
```

Optionally, you can pass custom options to the `snapScroll` function.

```javascript
$(document).ready(function () {
  $(window).snapScroll({
    arrowKeys: true,
    duration: 900,
    easing: 'easeInOutCubic',
    scrollBar: false,
    onLeave: function (currentPoint, targetPoint) {
      console.log('Ahhh, where am I going?!')
    }
  })
})
```

The `snapScroll` function can be called on any element with a scroll height greater than its height (i.e. with a scrollbar).

```javascript
$(document).ready(function () {
  $('#someElement').snapScroll({
    duration: 1200
  })
})
```

## 2. Configuration

#### 2.1. Options

* `arrowKeys` (default `false`): When set to `true`, keyboard arrow keys can be used to navigate between snap points. If set to `true` for more than one container, all elements will scroll.

* `duration` (default `600`): The duration in milliseconds of the animation between snap points.

* `easing` (default `'swing'`): The transition effect of the scroll animation. The easing functions included with jQuery are:

    * `swing`
    * `linear`

    If you have included the `jquery.easing.min.js` file (see [Including Files](#11-including-files)), then you can use [additional easing functions](http://api.jqueryui.com/easings/).

* `ordered` (default `true`): Defines if the snap points should be scrolled through in their markup order, or if a separate order has been specified.

* `scrollBar` (default `true`): When set to `false`, the scroll bar of the container element will be hidden.

#### 2.2. Callbacks

* `onLeave(currentPoint, nextPoint)`: Called when leaving a snap point i.e. when the animation is starting.

    * `currentPoint`: Index of the current snap point.
    * `nextPoint`: Index of the target/destination snap point.

    From the `onLeave` function, you can return an object of custom options which will override the options you passed snapScroll on initialisation. For example,

    ```javascript
    $(document).ready(function () {
      $(window).snapScroll({
        onLeave: function (currentPoint, nextPoint) {
          // If scrolling between points 3 and 4.
          if (currentPoint === 3 && nextPoint === 4) {
            // Make the animation really slow.
            return {
              duration: 4000
            }
          }
        }
      })
    })
    ```

    It is also possible to cancel the animation by using `cancel: true`:

    ```javascript
    $(document).ready(function () {
      $(window).snapScroll({
        onLeave: function (currentPoint, nextPoint) {
          // Cancel if scrolling to point 5.
          if (nextPoint === 5) {
            return {
              cancel: true
            }
          }
        }
      })
    })
    ```

* `onArrive(prevPoint, currentPoint)`: Called when arriving at a snap point i.e. when the animation has finished.

    * `prevPoint`: Index of the previous snap point.
    * `currentPoint`: Index of the new current snap point.

#### 2.3. Methods

All methods should be called on the SnapScroll object, returned by the call to `snapScroll`.

* `scrollPrev()`: Scroll to the previous snap point.

* `scrollNext()`: Scroll to the next snap point.

* `scrollToPoint(targetPoint, newOptions)`: Scroll to the given snap point.

    * `targetPoint`: Index of the target snap point.
    * `newOptions`: New options to override current options (**optional**).

* `currentPoint()`: Gets the index of the nearest snap point.

* `enable()`: Enable snap scrolling within the element (called on initialisation).

* `disable()`: Disable snap scrolling within the element.

```javascript
$(document).ready(function () {
  var ss = $(window).snapScroll()

  ss.scrollToPoint(3, {
    duration: 1200,
    easing: 'easeOutBounce'
  })
  ss.disable()
})
```

#### 2.4. Variables

Similarly, two variables are exposed via the SnapScroll object.

* `scrolling` (boolean): Flag to indicate the scrolling state.

* `snapPoints` (object): Array of the snap points.

```javascript
$(document).ready(function () {
  var ss = $(window).snapScroll()

  // Is the element scrolling?
  console.log(ss.scrolling)

  // Inner HTML of first snap point.
  console.log(ss.snapPoints[0].innerHTML)
})
```

## 3. Compatibility

**All modern browsers are supported.**

* **Chrome**: &ge;  26

* **Firefox**: &ge; 21

* **Edge**: &ge; 14*

* **Opera**: &ge; 15

* **Safari**: &ge; 6.2

* **Internet Explorer**: Not supported

\* Edge does not fire the 'wheel' event when scrolling with the 2-finger gesture on a Precision Touchpad. See issue [here](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7134034/).

[<img src="./example/images/browserstack.png" width="300">](http://www.browserstack.com/)

Browser compatibility has been tested using [BrowserStack](http://www.browserstack.com/), huge thanks to them for supporting the project!

## 4. License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
