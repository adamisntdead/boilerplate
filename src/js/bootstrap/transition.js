const $ = require('jquery')

function transitionEnd() {
  const el = document.createElement('bootstrap')

  const transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  }

  for (const name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      return { end: transEndEventNames[name] }
    }
  }

  return false // explicit for ie8 (  ._.)
}

// http://blog.alexmaccaw.com/css-transitions
$.fn.emulateTransitionEnd = function(duration) {
  let called = false
  const $el = this
  $(this).one('bsTransitionEnd', () => {
    called = true
  })
  const callback = () => {
    if (!called) $($el).trigger($.support.transition.end)
  }
  setTimeout(callback, duration)
  return this
}

$(() => {
  $.support.transition = transitionEnd()

  if (!$.support.transition) return

  $.event.special.bsTransitionEnd = {
    bindType: $.support.transition.end,
    delegateType: $.support.transition.end,
    handle(e) {
      if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
    }
  }
})
