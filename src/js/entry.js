// To avoid jQuery not being loaded before some of the local modules,
// there is an entry point here, which loads jQuery along with it's
// plugins, and then continues with the main javascript

const jQuery = require('jQuery')

global.jQuery = jQuery
global.$ = jQuery

require('jquery-match-height')
require('jquery-sticky')
require('./main')
