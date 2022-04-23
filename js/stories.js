"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();            //this is how we populate the global variable storyList
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  //putStoriesOnFavorites()
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
 
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

 $submitForm.on("submit", addStoryFromForm);

 function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

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
  //let username = currentUser.username
  //let token = currentUser.loginToken
  
  let getLi = $(evt.target).closest("li");
  let storyId = getLi.attr("id");
  //console.log(storyId)
   //$(".fa-star far").class("fa-star fas")
   const story = storyList.stories.find(s => s.storyId === storyId)
   const favorites = await currentUser.addFavorite(currentUser, story)
   
   return favorites
   

}


$allStoriesList.on("click",".star", updateUserFavorites)



function putStoriesOnFavorites(){
  console.debug("putStoriesOnFavorites")
  $favoritestorieslist.empty()


  for (let favorite of currentUser.favorites){
    const $favorite = generateStoryMarkup(favorite)
    $favoritestorieslist.append($favorite)
  }
  $favoritestorieslist.show();


}

  async function removeFavorite(evt){
  console.debug("deleteStoriesOnFavorites")
  $(evt.target).toggleClass("fas")
  
  
  let getLi = $(evt.target).closest("li")
  let storyId = getLi.attr("id")
  const story = storyList.stories.find(s => s.storyId === storyId)
   await currentUser.removeFavorite(currentUser, story)
   
   console.log(evt.target)
   let remove = $(evt.target).closest("li")
   remove.css("display", "none")

   //$("#favorite-stories-list").$(evt.target).empty()
   //$favorites.show()
   
   //return favorites

}

$favorites.on("click", ".star", removeFavorite)




async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}
// we need to append our clickable favorites button to every story
$ownStories.on("click", ".star", deleteStory)