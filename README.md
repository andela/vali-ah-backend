Authorss Haven - A Social platform for the creative at heart.
=======

[![Build Status](https://travis-ci.org/andela/vali-ah-backend.svg?branch=develop)](https://travis-ci.org/andela/vali-ah-backend) [![Coverage Status](https://coveralls.io/repos/github/andela/vali-ah-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/vali-ah-backend?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/08b713ce3211374e1d39/maintainability)](https://codeclimate.com/github/andela/vali-ah-backend/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/08b713ce3211374e1d39/test_coverage)](https://codeclimate.com/github/andela/vali-ah-backend/test_coverage) [![](https://img.shields.io/badge/Reviewed_by-Hound-blueviolet.svg)](https://houndci.com)

## Vision
Create a community of like minded Authorss to foster inspiration and innovation
by leveraging the modern web.

---

## API Spec
The preferred JSON object to be returned by the API should be structured as follows:

### Userss (for authentication)

```source-json
{
  "Users": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "Usersname": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}
```
### Profile
```source-json
{
  "profile": {
    "Usersname": "jake",
    "bio": "I work at statefarm",
    "image": "image-link",
    "following": false
  }
}
```
### Single Articles
```source-json
{
  "Articles": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "Authors": {
      "Usersname": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```
### Multiple Articless
```source-json
{
  "Articless":[{
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "Authors": {
      "Usersname": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }, {

    "slug": "how-to-train-your-dragon-2",
    "title": "How to train your dragon 2",
    "description": "So toothless",
    "body": "It a dragon",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "Authors": {
      "Usersname": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "ArticlessCount": 2
}
```
### Single Comment
```source-json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "Authors": {
      "Usersname": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```
### Multiple Comments
```source-json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "Authors": {
      "Usersname": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "commentsCount": 1
}
```
### List of Tags
```source-json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
```
### Errors and Status Codes
If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
### Other status codes:
401 for UnAuthorsized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the Users doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request


Endpoints:
----------

### Authentication:

`POST /api/Userss/login`

Example request body:

```source-json
{
  "Users":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a Users

Required fields: `email`, `password`

### Registration:

`POST /api/Userss`

Example request body:

```source-json
{
  "Users":{
    "Usersname": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a Users

Required fields: `email`, `Usersname`, `password`

### Get Current Users

`GET /api/Users`

Authentication required, returns a Users that's the current Users

### Update Users

`PUT /api/Users`

Example request body:

```source-json
{
  "Users":{
    "email": "jake@jake.jake",
    "bio": "I like to skateboard",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the Users

Accepted fields: `email`, `Usersname`, `password`, `image`, `bio`

### Get Profile

`GET /api/profiles/:Usersname`

Authentication optional, returns a Profile

### Follow Users

`POST /api/profiles/:Usersname/follow`

Authentication required, returns a Profile

No additional parameters required

### Unfollow Users

`DELETE /api/profiles/:Usersname/follow`

Authentication required, returns a Profile

No additional parameters required

### List Articless

`GET /api/Articless`

Returns most recent Articless globally by default, provide `tag`, `Authors` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by Authors:

`?Authors=jake`

Favorited by Users:

`?favorited=jake`

Limit number of Articless (default is 20):

`?limit=20`

Offset/skip number of Articless (default is 0):

`?offset=0`

Authentication optional, will return multiple Articless, ordered by most recent first

### Feed Articless

`GET /api/Articless/feed`

Can also take `limit` and `offset` query parameters like List Articless

Authentication required, will return multiple Articless created by followed Userss, ordered by most recent first.

### Get Articles

`GET /api/Articless/:slug`

No authentication required, will return single Articles

### Create Articles

`POST /api/Articless`

Example request body:

```source-json
{
  "Articles": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["reactjs", "angularjs", "dragons"]
  }
}
```

Authentication required, will return an Articles

Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings

### Update Articles

`PUT /api/Articless/:slug`

Example request body:

```source-json
{
  "Articles": {
    "title": "Did you train your dragon?"
  }
}
```

Authentication required, returns the updated Articles

Optional fields: `title`, `description`, `body`

The `slug` also gets updated when the `title` is changed

### Delete Articles

`DELETE /api/Articless/:slug`

Authentication required

### Add Comments to an Articles

`POST /api/Articless/:slug/comments`

Example request body:

```source-json
{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication required, returns the created Comment
Required field: `body`

### Get Comments from an Articles

`GET /api/Articless/:slug/comments`

Authentication optional, returns multiple comments

### Delete Comment

`DELETE /api/Articless/:slug/comments/:id`

Authentication required

### Favorite Articles

`POST /api/Articless/:slug/favorite`

Authentication required, returns the Articles
No additional parameters required

### Unfavorite Articles

`DELETE /api/Articless/:slug/favorite`

Authentication required, returns the Articles

No additional parameters required

### Get Tags

`GET /api/tags`
