# SportsManager_Server

## Introduction

REST API Server for SportsManager_Desktop or any other client program. Available to subscribe to `MQTT` clients which publish real-time game progress data to the server.

## Features

- Store data of competitions, games, and players
- REST API for CRUD of each data (See [API Rules](#api-rules) section)
- Update in real-time with MQTT Devices connected (See [Connect with a MQTT Device](#mqtt-rules) section)

## Tech Stack

- [`Node.js`](https://nodejs.org/)
- [`express.js`](https://expressjs.com)
- [`mongoose.js`](https://mongoosejs.com)
- [`moment.js`](http://momentjs.com)
- [`brcypt`](https://github.com/kelektiv/node.bcrypt.js)
- [`mqtt.js`](https://github.com/mqttjs/MQTT.js)
- [`mqtt-pattern.js`](https://github.com/RangerMauve/mqtt-pattern)

## Index

- [Prerequisite](#prerequisite)
- [How to use in local](#howto-local)
- [Connect with a MQTT Device](#mqtt-rules)
- [MQTT Topics and Event codes Rules](#topic-rules)
- [API Rules](#api-rules)

<a name="prerequisite"></a>
## Prerequisite

- MongoDB Server Instance (For data store)
- MQTT Broker Instance (For MQTT communication)
> MQTT Broker instance is not included in this project. You should run a MQTT broker by yourself, or see [SportsManager_Broker repository](https://github.com/cadenzah/SportsManager_Broker) to set simple and easy MQTT broker instance.

<a name="howto-local"></a>
## How to use in local

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
> - PORT: The port number for the web server (default value is `8080`)
> - DB_NAME: The MongoDB database name (default value is `sports-manager`)
> - DB_IP: IP address where MongoDB is running (default value is `localhost`)
> - DB_PORT: The port number for the DB (default value is `27017`)
> - BROKER_IP: The IP address where MQTT broker instance is running (default value is `localhost`)
> - BROKER_PORT: The port number for the MQTT broker instance (default value is `1883`)

6. Run the web server
```bash
$ npm run start
```

<a name="mqtt-rules"></a>
## Connect with a MQTT Device

### Simple Usage Tutorial

1. Publish by `/connect` topic to the server with the device's ID included. The server will subscribe to the afterward messages based on the device ID you just sent.

2. Publish by `/event/<deviceId>` with `gameId`, `eventCode`, `content` included.

3. Subscribe to `/update/<deviceId>` and utilize responses from the server

### NOTES

- **The messages have to be serialized during transaction.** When you receive a message, **use it after deserializing it.** This is due to that a message is stored in the broker as `Buffer` type data.

- To learn how to configure the message, See the table in [MQTT Topics and Event Codes Rule](#topic-rules) section below.

<a name="topic-rules"></a>
## MQTT Topics and Event Codes Rule

### Index

- [`/connect`](#connect)
- [`/event/<deviceId>`](#event)
- [Event Codes Rule](#event-rules)
- [`/update/<deviceId>`](#update)

<a name="connect"></a>
### Generating Initial Connection

Usage|Method Topic|Resource Topic|Description
-|-|-|-
`Publish`|`/connect`| *none* |Initialize a connection between the device and the server

- Message Form: (`JSON`)

```json
{
  "content": "device ID who tries to use this service"
}
```

<a name="event"></a>
### Emitting an event from a game

Usage|Method Topic|Resource Topic|Description
-|-|-|-
`Publish`|`/event`|`/<deviceId>`|Emit an event occurred in a game for which the device is working

- Message Form: (`JSON`)

```json
{
  "gameId": "game ID about which the device is trying to emit an event",
  "eventCode": "pre-defined event code (See the table below)",
  "content": "additional information about the event (Mostly used for event code 7)"
}
```

<a name="event-rules"></a>
### Event Codes Rule

Event code | `msg` string | Description
-|-|-
0|`device_ready`| Device is connected to the service
1|`in_progress`| Game started
2|`game_over`| Game ended
3|`team_A_scored_<Team A's score>:<Team B's score>`| Team A scored
4|`team_B_scored_<Team A's score>:<Team B's score>`| Team B scored
5|`team_A_deducted_<Team A's score>:<Team B's score>`| Team A deducted
6|`team_B_deducted_<Team A's score>:<Team B's score>`| Team B deducted
7|`problem_occurred`| Other cases i.e. player wound, no shuttlecock, player not shown...
-1|`update_failed`| Event from the device did not handled well in the server

<a name="update"></a>
### Receive a response from the server

Usage|Method Topic|Resource Topic|Description
-|-|-|-
`Subscribe`|`/update`|`/<deviceId>`|Receive a response from the server, whether the event sent was well processed or not.

- Message Form: (`JSON`)

  - If your `/event` topic message was successfully processed, you will get a success message.
  ```json
  {
    "msg": "short message about the result from the server",
    "eventCode": "event code's number 1~7"
  }
  ```

<a name="api-rules"></a>
## API Rules

### Index

- [`GET /player`](#get/player)
- [`GET /player/:id`](#get/player/:id)
- [`GET /player/:id/:competId`](#get/player/:id/:competId)
- [`POST /player`](#post/player)
- [`GET /game/:id`](#get/game/:id)
- [`PUT /game/:id`](#put/game/:id)
- [`POST /game/:competId`](#post/game/:competId)
- [`GET /game/list/:competId`](#get/game/list/:competId)
- [`GET /competition`](#get/competition)
- [`POST /competition`](#post/competition)
- [`GET /competition/:id`](#get/competition/:id)
- [`PUT /competition/:id`](#put/competition/:id)
- [`POST /competition/admin`](#post/competition/admin)
- [`GET /competition/:page/:count`](#get/competition/:page/:count)

<a name="get/player"></a>
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
      "birth": "the player's birthdate(`String(YYYY-MM-DD)`)"
    },
    {
      "more": "comes down..."
    },
  ]
  ```

<a name="get/player/:id"></a>
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
      "birth": "the player's birthdate(`String(YYYY-MM-DD)`)"
    }
    ```

<a name="get/player/:id/:competId"></a>
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
        "birth": "the player's birthdate(`String(YYYY-MM-DD)`)"
      },
      {
        "more": "comes down..."
      },
    ]
    ```

<a name="post/player"></a>
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
    "birth": "the player's birthdate(`String(YYYY-MM-DD)`)"
  }
  ```

  - Response Form:

    ```json
    [
      {
        "_id": "the player's ID(`ObjectId`)",
        "name": "the player's name(`String`)",
        "birth": "the player's birthdate(`String(YYYY-MM-DD)`)"
      },
      {
        "more": "comes down..."
      },
    ]
    ```

<a name="get/game/:id"></a>
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

<a name="put/game/:id"></a>
### - Modify a game's data

URI|Method|Description
-|-|-
`/game/:id`|`PUT`|Modify the data for the specified game

  - Request Parameter :

    `id`: The game's ObjectId(`MongoDB`)

  - Request Body :

    - You can include only fields that need to be modified, not all of them. But be careful not to include fields that are not in the DB Schema. There will be nothing happened, nor will it not give you any error(will be fixed later).
    - If you want to modify the fields of each teams(i.e. team A's score), specify the field you want to modify with nested object.


  ```json
  {
      "name_of_key_to_fix": "new_value",
      "team_A": { "score": 5 }
  }
  ```

  - Response Form:

    ```json
    {
      "msg":  "요청이 정상적으로 서버로 전송되었습니다만, 제대로 요청 사항이 반영되었는지 반드시 확인하세요!"
    }
    ```

<a name="post/game/:competId"></a>
### - Make a new game

URI|Method|Description
-|-|-
`/game/:competId`|`POST`|Generate new game for the specified competition

  - If the generated game is the initial game of the competition, the court number of it is 1. If the generated game is not the initial game, then the court number of it is 1 bigger than the latest generated game's court number.

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

<a name="get/game/list/:competId"></a>
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

<a name="get/competition"></a>
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
        "date": "when the competition is held(`String(YYYY-MM-DD)`)"
      },

      {
        "more": "competitions can come down..."
      }
    ]
    ```

<a name="post/competition"></a>
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
      "date": "when the competition is held(`String(YYYY-MM-DD)`)"
    }
    ```

<a name="get/competition/:id"></a>
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
      "date": "when the competition is held(`String(YYYY-MM-DD)`)"
    }
    ```

<a name="put/competition/:id"></a>
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

<a name="post/competition/admin"></a>
### - Check if the password for a competition is correct (Admin mode)
URI|Method|Description
-|-|-
`/competition/admin`|`POST`|Check if the password for a specific competition is correct or not.

- Request Parameter :

  `Not required`

- Request Body :

  ```JSON
  {
    "competId": "competition's id(`ObjectId`)",
    "password": "password set for the competition when it is generated",
  }
  ```

`Not required`

- Response Form:

```json
  {
    "msg": "true or false (`Boolean`)"
  }
```




<a name="get/competition/:page/:count"></a>
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
      "date": "when the competition is held(`String(YYYY-MM-DD)`)",
    }

    {
      "more": "competitions can come down..."
    }
  ]
  ```
