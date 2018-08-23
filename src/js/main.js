const plyr = require('plyr')
const $ = require('jquery')

require('./utils/scaling-bug')
require('./ui/nav')
require('./bootstrap/modal')
require('./bootstrap/transition')

$(document).ready(() => {
  $('.match-height').matchHeight()
  $('#sticky').sticky({
    topSpacing: 0,
    bottomSpacing: () => $('footer').outerHeight(true)
  })
  plyr.setup()
})
