# 1kbIdeas
The one-stop shop for all the self-help ideas you need

## Version: 1.0.0

### Terms of service


**Contact information:**  
  

**License:** [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)


### /articles/:articleId/comments

#### POST
##### Description:

Create comment for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| articleId | path |  | Yes |  |
| content | body | content of the comment. | Yes | string |
| repliedToId | body | id of comment it is replying to if any. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | comment posted |

#### GET
##### Description:

Get comments for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| articleId | path | articleId is the unique identifier for the article to get the comments | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Comments retrieved successfully |

### /articles/feed

#### GET
##### Description:

get paginated followed aticles

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /articles/bookmarks

#### GET
##### Description:

Get all bookmarked articles

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

#### POST
##### Description:

Bookmark an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| articleId | path |  | Yes |  |
| userId | body | The id of user posting the comment. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | article added to bookmark |

### /bookmarks

#### DELETE
##### Description:

Remove an article from bookmark

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| articleId | path |  | Yes |  |
| userId | body | The id of user posting the comment. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | article removed from bookmark |

### /articles

#### GET
##### Description:

Search for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| SearchArticles | path |  | Yes |  |
| tag | query | content of the articles. | Yes | string |
| title | query | content of the articles. | Yes | string |
| author | query | associate of the articles model. | No | string |
| includeSubscriptions | query | boolean to include articles in categories user is subscribed to | No | boolean |
| keyword | query | a search query for articles. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | request successful |
| 400 | keyword cannot be used with title, author or tag |

### /articles/{articleId}/vote

#### POST
##### Description:

up vote or down vote an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| Content-Type | header |  | Yes | string |
| articleId | path |  | Yes | string |
| voteType | formData | Vote type. i.e upVote, downVote or nullVote | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /articles/

#### POST
##### Description:

Create article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| summary | body | summary of article. | No | string |
| body | body | body of the article. | Yes | string |
| suspended | body | boolean to show if article is suspended or not. | No | boolean |
| title | body | title of the article. | No | string |
| tag | body | array of uuid's representing article categories. | No | [  ] |
| status | body | tells if the article is published or drafted | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | article created |

### /articles/{slug}

#### GET
##### Description:

Create a new user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| slug | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

#### PUT
##### Description:

Updates an existing article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| summary | body | summary of article. | No | string |
| body | body | body of the article. | Yes | string |
| suspended | body | boolean to show if article is suspended or not. | No | boolean |
| title | body | title of the article. | No | string |
| tag | body | array of uuid's representing article categories. | No | [  ] |
| status | body | tells if the article is published or drafted | No | string |
| slug | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

#### DELETE
##### Description:

deletes an article by slug

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| slug | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful delete |

### /articles/:articleId/inline_comments

#### POST
##### Description:

Create an inline comment for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| articleId | path |  | Yes |  |
| content | body | content of the comment. | Yes | string |
| startIndex | body | start index of highlight. | Yes | number |
| endIndex | body | end index of highlight | Yes | number |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | comment successfully created |

#### GET
##### Description:

Queries inline comments for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| articleId | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | comments successfully retrieved |

### /articles/inline_comments/commentId

#### PUT
##### Description:

Edit an inline comment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| commentId | path |  | Yes |  |
| content | body | content of the comment. | Yes | string |
| startIndex | body | start index of highlight. | No | number |
| endIndex | body | end index of highlight | No | number |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | comment updated |

#### DELETE
##### Description:

Create comment for an article

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| commentId | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | comment posted |

#### GET
##### Description:

Queries a single inline comment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| commentId | path |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Query successfull |

### /auth/signup

#### POST
##### Description:

Signup to the application

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userName | body | Username to use for login. | Yes | string |
| firstName | body | first name of the user. | Yes | string |
| lastName | body | last name of the user. | Yes | string |
| email | body | email of the user. | Yes | string |
| password | body | User's password. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | token is supplied |

### /auth/signin

#### POST
##### Description:

Signs in a user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body | User object | Yes | string |
| password | body | User object | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | user successfully signs in |

### /auth/signout

#### POST
##### Description:

Signs out a user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | User successfully signed out |

### /auth/twitter

#### GET
##### Description:

Authenticate user using twitter

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /auth/twitter/redirect

#### GET
##### Description:

Create a new user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /auth/reset_password

#### POST
##### Description:

Send password reset to user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body | user email | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /auth/update_password/:id/:token

#### PATCH
##### Description:

Update user password

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | params | user id | Yes | string |
| token | params | user token | Yes | string |
| password | body | user password | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /auth/{provider}

#### POST
##### Description:

Authenticate user using third party social account

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Content-Type | header |  | Yes | string |
| provider | path |  | Yes | string |
| accessToken | formData | User access token gotten from either facebook or google. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success |

### /authors

#### GET
##### Description:

get a list of all authors

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | authors found |
| 404 | authors not found |

### /comments/{commentId}/vote

#### POST
##### Description:

up vote or down vote a comment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| Content-Type | header |  | Yes | string |
| commentId | path |  | Yes | string |
| voteType | formData | Vote type. i.e upVote, downVote or nullVote | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /profile/:id

#### PATCH
##### Description:

update user profile

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userName | body | Username to update. | Yes | string |
| firstName | body | first name to update. | Yes | string |
| lastName | body | last name to update. | Yes | string |
| email | body | email to update. | Yes | string |
| avaterUrl | body | image to update. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | updated successfully. |
| 400 | not updated. |

#### GET
##### Description:

get a user profile

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | body | Username id. | Yes | UUID |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | request was successful. |
| 404 | user does not exist. |

### /profile/:userId/following

#### PATCH
##### Description:

following a user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | body | Users id. | Yes | UUID |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully followed  or unfollowed a user |
| 404 | User does not exist. |
| 409 | User cannot perform this action. |

### /profile/:userId/followers

#### GET
##### Description:

get all followers

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | body | Username id. | Yes | UUID |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Request was successful. |

### /profile/userId:/followings

#### GET
##### Description:

get all followings

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | body | Users id. | Yes | UUID |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Request was successful. |

### /users/subscriptions

#### POST
##### Description:

subscribe to categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Authorization | header |  | Yes | string |
| Content-Type | header |  | Yes | string |
| categories | body | A stringified version of an array of categories | Yes | [subscription](#subscription) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

