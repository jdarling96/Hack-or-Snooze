"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();            //this is how we populate the global variable storyList
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  putStoriesOnFavorites()
  $favorites.hide();
  
}

async function addStoryFromForm (evt) {
  console.debug("addStoryFromForm", evt)
  evt.preventDefault();
  
  
  const title = $("#create-title").val()
  const author = $("#create-author").val()
  const url = $("#create-url").val()
  const storyData = {title,author,url}

  const story = await storyList.addStory(currentUser, storyData);
 
  return story
}

 $submitForm.on("submit", addStoryFromForm);

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
      <i class="fa-star far" style="cursor: pointer;"></i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  //$(".fa-star").css('cursor', 'pointer')
}

async function updateUserFavorites(evt){
  $(evt.target).toggleClass("fas")
  let username = currentUser.username
  let token = currentUser.loginToken
  
  let getLi = $(evt.target).closest("li")
  let storyId = getLi[0].id
   //console.log(storyId)
   //$(".fa-star far").class("fa-star fas")
   const favorites = await currentUser.addAFavoriteStory(username, storyId, token)
   
   return favorites
   

}
$allStoriesList.on("click",".fa-star", updateUserFavorites)



function putStoriesOnFavorites(){
  console.debug("putStoriesOnFavorites")
  $favoritestorieslist.empty()


  for (let favorite of currentUser.favorites){
    const $favorite = generateStoryMarkup(favorite)
    $favoritestorieslist.append($favorite)
  }
  $favoritestorieslist.show();


}

  async function deleteStoriesOnFavorite(evt){
  console.debug("deleteStoriesOnFavorites")
  $(evt.target).toggleClass("fas")
  let username = currentUser.username
  let token = currentUser.loginToken
  
  let getLi = $(evt.target).closest("li")
  let storyId = getLi[0].id
  
   const favorites = await currentUser.deleteAFavoriteStory(username, storyId, token)
   
   return favorites

}

$favorites.on("click", ".fa-star", deleteStoriesOnFavorite)

// we need to append our clickable favorites button to every story
