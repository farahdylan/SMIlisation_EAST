

(function(){

/*****************************************************************************\
|                                                                             |
| This library adds 'navigation' support to timesheets.js.                    |
|                                                                             |
| As this is *NOT* part of the SMIL/Timing recommendation:                    |
|   * the microformat syntax is likely to change in upcoming versions         |
|   * this can be rather easily extended to support additional features       |
|                                                                             |
\*****************************************************************************/

function bindNavControls(timeContainer, navigation) {
  function hasControl(control) {
    var re = new RegExp("(^|[\\s;]+)" + control + "([\\s;]+|$)", "i");
    return re.test(navigation);
  }

  // get slideshow node
  var slideshow = timeContainer.target; // works fine with inline timing but...
  if (!slideshow) // ...sometimes the timeContainer is defined in a timesheet
    slideshow = timeContainer.timeNodes[0].target.parentNode;

  // keyboard events: http://unixpapa.com/js/key.html
  if (hasControl("arrows")) EVENTS.bind(document, "keydown", function(e) {
    var index = timeContainer.currentIndex;     // index of the current slide
    var count = timeContainer.timeNodes.length; // number of slides
    var slide = timeContainer.timeNodes[index]; // current slide
    switch(e.keyCode) {
      case 32: // spacebar => next/prev slide
        EVENTS.preventDefault(e);
        if (e.shiftKey)
          timeContainer.selectIndex(index - 1);
        else
          timeContainer.selectIndex(index + 1);
        break;
      case 35: // end key => last slide
        EVENTS.preventDefault(e);
        timeContainer.selectIndex(count - 1);
        break;
      case 36: // home key => first slide
        EVENTS.preventDefault(e);
        timeContainer.selectIndex(0);
        break;
      case 37: // left arrow key => previous slide
        EVENTS.preventDefault(e);
        timeContainer.selectIndex(index - 1);
        break;
      case 38: // up arrow key => restart current slide
        EVENTS.preventDefault(e);
        slide.reset();
        slide.show();
        break;
      case 39: // right arrow key => next slide
        EVENTS.preventDefault(e);
        timeContainer.selectIndex(index + 1);
        break;
      case 40: // down arrow key => click on current slide
        EVENTS.preventDefault(e);
        EVENTS.trigger(slide.target, "click");
        break;
      default:
        break;
    }
  });

  // mouse clicks: http://unixpapa.com/js/mouse.html
  if (hasControl("click")) EVENTS.bind(slideshow, "mousedown", function(event) {
    // IE doesn't support event.which, relying on event.button instead
    var button = event.which || ([0,1,3,0,2])[event.button];
    if (button == 1)      // left click => next slide
      timeContainer.selectIndex(timeContainer.currentIndex + 1);
    else if (button == 2) // middle click => previous slide
      timeContainer.selectIndex(timeContainer.currentIndex - 1);
  });

  // mouse scroll: http://adomas.org/javascript-mouse-wheel/
  if (hasControl("scroll")) {
    function onMouseWheel(event) {
      if (event) {
        if (event.ctrlKey) return;
        event.preventDefault();
      }
      else {
        event = window.event;
        if (event.ctrlKey) return;
        event.returnValue = false;
      }
      // get scroll direction
      var delta = 0;
      if (event.wheelDelta) { // IE, Opera
        delta = event.wheelDelta / 120;
      } else if (event.detail) { // Mozilla
        delta = -event.detail / 3;
      }
      // prev/next slide
      if (delta < 0)
        timeContainer.selectIndex(timeContainer.currentIndex + 1);
      else if (delta > 0)
        timeContainer.selectIndex(timeContainer.currentIndex - 1);
    }
    if (window.addEventListener) // DOMMouseScroll is specific to Mozilla
      slideshow.addEventListener("DOMMouseScroll", onMouseWheel, false);
    slideshow.onmousewheel = onMouseWheel;
  }

  // update the hash whenever possible
  if (hasControl("hash")) {
    var timeNodes = timeContainer.timeNodes;
    for (var i = 0; i < timeNodes.length; i++) {
      var target = timeNodes[i].target;
      if (target.id) EVENTS.bind(target, "begin", function() {
        document.location.hash = "#" + this.id;
      });
    }
  }
}

EVENTS.onSMILReady(function() {
  // activate all navigation bindings
  var containers = document.getTimeContainersByTagName("*");
  for (var i = 0; i < containers.length; i++) {
    // parse the "navigation" attribute and get the target element
    // (works with "navigation", "data-navigation", "smil:navigation" and so on)
    var navigation = containers[i].parseAttribute("navigation");
    if (navigation) {
      bindNavControls(containers[i], navigation);
    }
  }
});

})();
