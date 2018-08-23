// A fix for an old IOS safari bug where the viewport wouldn't scale properly.

if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
  const addEvent = 'addEventListener'
  const type = 'gesturestart'
  const qsa = 'querySelectorAll'
  let scales = [1, 1]
  let meta = qsa in document ? document[qsa]('meta[name=viewport]') : []

  function fix() {
    meta.content = `width=device-width,minimum-scale=${scales[0]},maximum-scale=${scales[1]}`
    document.removeEventListener(type, fix, true)
  }

  if ((meta = meta[meta.length - 1]) && addEvent in document) {
    fix()
    scales = [0.25, 1.6]
    document[addEvent](type, fix, true)
  }
}
