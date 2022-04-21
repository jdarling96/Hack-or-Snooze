"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();                       //hides everything in the nav bar as well as list of stories
  putStoriesOnPage();
  $submitForm.css("display", "none")                         //populates the ordered list of stories from the global storyList variable// the variable is an instace of the StoryList object
}

$body.on("click", "#nav-all", navAllStories);             //click on Hack or Snooze and run navAllStories()

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitForm(evt) {
  console.debug("navLoginClick", evt);
  $submitForm.css("display", "flex");

}
$("#nav-submit").on("click", navSubmitForm)

function navFavoritesClick(evt){
  console.debug("navFavoriteClick", evt);
  //$allStoriesList.css("display", "none");
  $allStoriesList.hide();
  $favorites.css("display", "block");

}

$("#nav-favorites").on("click", navFavoritesClick)