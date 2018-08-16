//iPad scaling bug	 	
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) { 
	var viewport = document.querySelector('meta[name="viewport"]');
	if (viewport) { 
		viewport.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0'; 
		document.body.addEventListener('gesturestart', function() 
			{ viewport.content = 'width=device-width, minimum-scale=1.0, maximum-scale=2.0'; }, false); 	
	} 
}

// MAIN MENU NAVIGATION ---

// Toggle nav menu
$('#nav-toggle').click(function() {
  $('.nav, #nav-toggle, .main').toggleClass('in');

});

// Mobile

  // Primary links
  $('.nav-list-primary__drop').click(function() {

    // Mobile 
    if ($(window).width() < 760) {
      $('.nav-list-primary__drop').not(this).next('ul').slideUp(250).removeClass('in'); // close all menus but the one clicked
      $('.nav-list-primary__drop').not(this).next('ul').find('ul').hide().removeClass('in');
      $(this).next('ul').slideToggle(250).toggleClass('in'); // open respective submenu (scondary)
    } else {
    // Desktop
      $('.nav-list-primary__drop').not(this).next('ul').hide().removeClass('in'); // close all menus but the one clicked
      $('.nav-list-primary__drop').removeClass('active') // remove all active classes
      $(this).addClass('active');
      $('.nav-list-primary__drop').not(this).next('ul').find('ul').hide().removeClass('in');
      $(this).next('ul').toggle().toggleClass('in'); // open respective submenu (scondary)
    }
  });

  
  // Toggle all submenus
  $('[data-toggle]').click(function() {

    // Mobile
    if ($(window).width() < 760) {
      $(this).next('ul').slideToggle(250).toggleClass('in'); // open respective submenu
    } else {
    // Desktop
      $(this).next('ul').slideToggle(250).toggleClass('in'); // open respective submenu
      $(this).toggleClass('in');
    }
  });

  // Close submenus on window click - desktop
  $(window).click(function() {
    if ($(window).width() >= 760) {
      $('.nav-list-primary__drop').not(this).next('ul').hide().removeClass('in'); // close all menus but the one clicked
      $('.nav-list-primary__drop').not(this).next('ul').find('ul').hide().removeClass('in');
      $('.nav-list-primary__drop').removeClass('active');    
    }
  });

  $('.nav-list-primary').click(function(event){
      if ($(window).width() >= 760) {
        event.stopPropagation();
      }
  });

// Toggle search box
$('.nav__search > a').click(function() {
  $(this).toggleClass('active');
  $('.nav__search-input').toggleClass('in');
});

// MAIN MENU NAVIGATION ./end


// PAGE LOADED
$(document).ready(function() {
  // Match columns
  $('.match-height').matchHeight();

  // Sticky side nav
  $("#sticky").sticky({
    topSpacing:0,
    bottomSpacing: function(){
      var bottom;
      bottom = $('foter').outerHeight(true);
      return bottom;
    },
  });

  // Load video player
  plyr.setup();
  
});