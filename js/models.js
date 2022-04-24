"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    return new URL(this.url).host
    //
  }
}
// CONFUSED ON HOW THE ABOVE OBJ METHOD getHostName() WORKS.


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, {title, author, url}) {
    // UNIMPLEMENTED: complete this function!
   //const user = await User.loginViaStoredCredentials(token, username);
   const token = user.loginToken;
  
    
  const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {token, story: {title, author, url}}
    }) 
    
    
    const story = new Story(response.data.story)
    
    this.stories.unshift(story)
    user.ownStories.unshift(story)

    
    return story

    
  
  }

  async removeStory(user, storyId) {
  const token = user.loginToken;                // I believe I can get rid of this as the token is being found in the body
  await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    data: { token: user.loginToken }
  });

  // filter out the story whose ID we are removing
  this.stories = this.stories.filter(story => story.storyId !== storyId);

  // do the same thing for the user's list of stories & their favorites
  user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
  user.favorites = user.favorites.filter(s => s.storyId !== storyId);
}
}
//LIVE CODE REVIEW: to better understand... this.stories = returns all the stories that does not equal the storyId that we passed through to be deleted...the rest of the stories?

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;
    
    //LIVE CODE REVIEW: is the syntax above  let { user } = response.data object destructuring? is it putting the response.data into a user object
    
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
         

  async addFavorite(user, story) {
    const username = user.username;
    const token = user.loginToken;
    const { storyId } = story;
    try {
      await axios.post(
        `${BASE_URL}/users/${username}/favorites/${storyId}`,
        { token }
      );
      user.favorites.unshift(story);
    } catch (e) {
      console.log(e);
    }
  }

      
  
       async removeFavorite(user, story) {
          const username = user.username;
          const token = user.loginToken;
          const { storyId } = story;
          
          // LIVE CODE REVIEW: same as above still confused on how  const { storyId } = story; works. I used it here as I saw it was used in the User class
          
            await axios.delete(
              `${BASE_URL}/users/${username}/favorites/${storyId}`,
              { data: { token } }
            );
           for(let i of user.favorites) {                                  // I wonder if its possible to use MAP here instead of a for of loop?
             if(i.story === user.favorites.story)
             user.favorites.splice(user.favorites.indexOf(story), 1)

           }
          }
          // LIVE CODE REVIEW: on
          
            
          

        
      
      }
          



