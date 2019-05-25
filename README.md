# SportsManager_Server

## Introduction

REST API Server for SportsManager_Desktop or any other client program.

## Features

## Tech Stack

- `Node.js`
- `express.js`
- `mongoose.js` (`MongoDB`)
- `brcypt`

## How to use

1. Run `mongod`
```bash
$ sudo mongod
```
2. Download the project
```bash
$ git clone https://gitbub.com/cadenzah/SportsManager_Server.git
```
3. Locate into project's folder
4. Install npm modules
```bash
$ cd SportsManager_Server
$ npm install
```
5. Make `.env` file. This file includes environment values used in the server. Those values include:
> - PORT: The port number for the web server
> - DB_NAME: The MongoDB database name
> - DB_IP: IP address where MongoDB is running
> - DB_PORT: The port number for the DB
6. Run the web server
```bash
$ npm run start
```

## API Rules

### Index

- `GET /player`
- `GET /player/:id`
- `GET /player/:id:competId`
- `POST /player`
- `GET /game/:id`
- `PUT /game/:id`
- `POST /game/:competId`
- `GET /game/list/:competId`
- `GET /competition`
- `POST /competition`
- `GET /competition/:id`
- `PUT /competition/:id`
- `GET /competition/:page/:count`

### - Get all players' data

URI|Method|Description
-|-|-
`/player`|`GET`|Get data of all users registered in this service

- Parameter :

  `Not required`

- Payload :

  `Not required`

- Response Form:

  ```json
  [
    {
      "_id": "the player's ID(`ObjectId`)",
      "name": "the player's name(`String`)",
      "birth": "the player's birthdate(`Date`)"
    },
    {
      "more": "comes down..."
    },
  ]
  ```

### - Get a player's data

URI|Method|Description
-|-|-
`/player/:id`|`GET`|Get data of a user specified by URI parameter

  - Request Parameter :

    `id`: The player's ObjectId(`MongoDB`)

  - Request Body :

    `Not required`

  - Response Form:

    ```json
    {
      "_id": "the player's ID(`ObjectId`)",
      "name": "the player's name(`String`)",
      "birth": "the player's birthdate(`Date`)"
    }
    ```

### - Get players' data for the competition

URI|Method|Description
-|-|-
`/player/:id/:competId`|`GET`|Get data of users registered in the specified competition

  - Request Parameter :

    `competId`: The competition's ObjectId(`MongoDB`)

  - Request Body :

    `Not required`

  - Response Form:

    ```json
    [
      {
        "_id": "the player's ID(`ObjectId`)",
        "name": "the player's name(`String`)",
        "birth": "the player's birthdate(`Date`)"
      },
      {
        "more": "comes down..."
      },
    ]
    ```

### - Register new player

URI|Method|Description
-|-|-
`/player`|`POST`|Generate new player in the service

  - Request Parameter :

    `Not required`

  - Request Body :

  ```json
  {
    "name": "the player's name(`String`)",
    "birth": "the player's birthdate(`Date`)"
  }
  ```

  - Response Form:

    ```json
    [
      {
        "_id": "the player's ID(`ObjectId`)",
        "name": "the player's name(`String`)",
        "birth": "the player's birthdate(`Date`)"
      },
      {
        "more": "comes down..."
      },
    ]
    ```

### - Get a game's data

URI|Method|Description
-|-|-
`/game/:id`|`GET`|Get a data for the specified game

  - Request Parameter :

    `id`: The game's ObjectId(`MongoDB`)

  - Request Body :

  `Not required`

  - Response Form:

    ```json
    {
      "court": "the court number where the game is held",
      "number": "the game number",
      "state": "game's current state",
      "isLeaf": "a flag value to tell whether the game is in tournament's leaf or not",
      "_id": "the game's id(`ObjectId`)",
      "team_A": {
          "score": "team A's current score",
          "players": [
              "team A's members list(`ObjectId`)"
          ],
          "_id": "ObjectId for this JSON object (Not used)"
      },
      "team_B": {
          "score": "team B's current score",
          "players": [
              "team B's members list(`ObjectId`)"
          ],
          "_id": "ObjectId for this JSON object (Not used)"
      },
      "competition_id": "the competition id where the game belongs to",
      "__v": "version value for this document (Not used)"
    }
    ```

### - Modify a game's data

URI|Method|Description
-|-|-
`/game/:id`|`PUT`|Modify the data for the specified game

  - Request Parameter :

    `id`: The game's ObjectId(`MongoDB`)

  - Request Body :

  You can include only fields that need to be modified, not all of them. But be careful not to include fields that are not in the DB Schema. There will be nothing happened, nor will it not give you any error(will be fixed later).

  ```json
  {
      "name_of_key_to_fix": "new_value",
  }
  ```

  - Response Form:

    ```json
    {
      "msg":  "요청이 정상적으로 서버로 전송되었습니다만, 제대로 요청 사항이 반영되었는지 반드시 확인하세요!"
    }
    ```

### - Make a new game

URI|Method|Description
-|-|-
`/game/:competId`|`POST`|Generate new game for the specified competition

  - Request Parameter :

    `competId`: The competition's ObjectId(`MongoDB`)

  - Request Body :

  ```json
  {
    "team_A": {
        "players": [
            "team A's members list(`ObjectId`)",
            "one or more ids..."
        ]
    },
    "team_B": {
        "players": [
            "team B's members list(`ObjectId`)",
            "one or more ids..."
        ]
    }
  }
  ```

  - Response Form:

    ```json
    {
      "court": "the court number where the game is held",
      "number": "the game number",
      "state": "game's current state",
      "isLeaf": "a flag value to tell whether the game is in tournament's leaf or not",
      "_id": "the game's id(`ObjectId`)",
      "team_A": {
          "score": "team A's current score",
          "players": [
              "team A's members list(`ObjectId`)"
          ],
          "_id": "ObjectId for this JSON object (Not used)"
      },
      "team_B": {
          "score": "team B's current score",
          "players": [
              "team B's members list(`ObjectId`)"
          ],
          "_id": "ObjectId for this JSON object (Not used)"
      },
      "competition_id": "the competition id where the game belongs to",
      "__v": "version value for this document (Not used)"
    }
    ```

### - Get a list of games for a competition

URI|Method|Description
-|-|-
`/game/list/:competId`|`GET`|Get the full list of games which are held for a specified competition

  - Request Parameter :

    `competId`: The competition's ObjectId(`MongoDB`)

  - Request Body :

    `Not required`

  - Response Form:

    ```json
    [
      {
        "court": "the court number where the game is held",
        "number": "the game number",
        "state": "game's current state",
        "isLeaf": "a flag value to tell whether the game is in tournament's leaf or not",
        "_id": "the game's id(`ObjectId`)",
        "team_A": {
            "score": "team A's current score",
            "players": [
                "team A's members list(`ObjectId`)"
            ],
            "_id": "ObjectId for this JSON object (Not used)"
        },
        "team_B": {
            "score": "team B's current score",
            "players": [
                "team B's members list(`ObjectId`)"
            ],
            "_id": "ObjectId for this JSON object (Not used)"
        },
        "competition_id": "the competition id where the game belongs to",
        "__v": "version value for this document (Not used)"
      },
      {
        "more": "games can come down..."
      }
    ]
    ```

### - Get the list of data of competitions

URI|Method|Description
-|-|-
`/competition`|`GET`|Get the full list of competitions registered in the service

  - Request Parameter :

    `Not required`

  - Request Body :

    `Not required`

  - Response Form:

    ```json
    [
      {
        "_id": "competition's id(`ObjectId`)",
        "name": "competition's title or name",
        "location": "where the competition is held",
        "password": "the password for this competition"
      },

      {
        "more": "competitions can come down..."
      }
    ]
    ```

### - Make a new competition

URI|Method|Description
-|-|-
`/competition`|`POST`|Generate a new competition

  - Request Parameter :

    `Not required`

  - Request Body :

    ```json
    {
      "name": "competition's title or name",
      "location": "where the competition is held",
      "password": "the password for this competition"
    }
    ```

  - Response Form:

    ```json
    {
      "_id": "competition's id(`ObjectId`)",
      "name": "competition's title or name",
      "location": "where the competition is held",
      "password": "the password for this competition"
    }
    ```

### - Get the data of a competition

URI|Method|Description
-|-|-
`/competition/:id`|`GET`|Get the data for a specified competition

  - Request Parameter :

    `id` : The competition's id(`MongoDB`)

  - Request Body :

    `Not required`

  - Response Form:

    ```json
    {
      "_id": "competition's id(`ObjectId`)",
      "name": "competition's title or name",
      "location": "where the competition is held",
      "password": "the password for this competition"
    }
    ```

### - Modify the data of a competition

URI|Method|Description
-|-|-
`/competition/:id`|`PUT`|Modify the data for a specified competition

  - Request Parameter :

    `id` : The competition's id(`MongoDB`)

  - Request Body :

  You can include only fields that need to be modified, not all of them. But be careful not to include fields that are not in the DB Schema. There will be nothing happened, nor will it not give you any error(will be fixed later).

  ```json
  {
      "name_of_key_to_fix": "new_value",
  }
  ```

  - Response Form:

    ```json
    {
      "msg":  "요청이 정상적으로 서버로 전송되었습니다만, 제대로 요청 사항이 반영되었는지 반드시 확인하세요!"
    }
    ```

### - Get a limited list of data of competitions

URI|Method|Description
-|-|-
`/competition/:page/:count`|`GET`|Get a limited amount of data of competitions specified by parameters

  - Request Parameter :

    - `page` : the number of page
    - `count` : the number of data in each page

  - Request Body :

  `Not required`

  - Response Form:

  ```json
  [
    {
      "_id": "competition's id(`ObjectId`)",
      "name": "competition's title or name",
      "location": "where the competition is held",
      "password": "the password for this competition"
    },

    {
      "4 more": "competitions can come down..."
    }
  ]
  ```
