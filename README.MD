This repository contains the prototype of a GraphQL-Server I developed during the summer semester 2018 for my bachelor's thesis,
which has the title "GraphQL for flexible Web APIs - a case study". It intentionally includes files that normally would not be commited, 
such as config and `.env` files, so for others it is easier to understand how the different components are wired and work together.
The code is far from being finished and will continuously be improved. Feel free to use both code and architecture as an inspiration for you work.

## Set up and Start

This app can be run either with or without Docker

#### With Docker
If you want to use it with Docker, start Docker and navigate into the project's root folder 
and execute:
```bash
docker-compose -f docker-compose-server-only.yml up
```

If you want to clean up after the project, simply run:

```bash
docker-compose -f docker-compose-server-only.yml down
```

#### Without Docker
To use the app without Docker, you will need a running MongoDB instance on you machine to connect to. 

Hint: You will have to start `mongod.exe` and `mongo.exe` both in separate Terminal processes.

Database seeding will be done automatically once you run `npm start` but before you can do that, there needs to be a 
`user` for the sake of authentication and without Docker you have to create one yourself yourself.

Use the already started `mongo shell` process and execute:
```mongo
db = db.getSiblingDB('btss2018');
```
then execute:

```mongo
db.createUser({
    user: 'app-user',
    pwd: 'app-password',
    roles: [
        {
            role: 'readWrite',
            db: 'btss2018'
        }
    ]
});
```
Hint: Since the newly created user will be persisted in the database (You didn't see that coming, did you?) that you create with the first
command, you won't have to re-execute them, before shutting down and re-starting the app, as long as you don't delete the database or want to use a different one. 

Hint: The values of the previous two commands match the values inside `.env` and `server/server-config.js`

Before you now navigate to the `server` folder inside the project and run `nmp start`, make sure to change the `host`
values of the `server/server-config.js` file as recommend there. (Check the comments)


## Use the app

Once the app has started successfully, open either `192.168.99.100:4000/graphql/` or `localhost:4000/graphql/` inside your browser.

Some operations, especially deletions and edits, require you to be logged in to the app, which requires you to sign up first.

For signing up, paste this into `QUERY VARIABLES` field:
```graphql
{
  "credentials":
  {
    "username": "yourname",
    "email": "email@gmail.com",
    "password": "123",
    "role": "ADMIN"
  }
}
 ```
and then execute this mutation:

```graphql
mutation signup($credentials: UserSignUpInput!) {
   signup(credentials: $credentials) {
     user {
       username
       password
       email
       role
     }
     token
   }
 }
 ```
 
Now to login, paste this into the `QUERY VARIABLES` field:
 
```graphql

{
  "credentials":  {
    "email":"email@gmail.com",
    "password": "123" 
  }
}
```

and then execute this mutation:

```graphql
mutation login($credentials: UserLoginInput!) {
  login(credentials: $credentials) {
    user {
      _id
      username
    }
    token
  }
}
 ```
 
Besides a `user` object, the mutation above will also return a `token` field. 
This `token` needs to pasted into the `HTTP HEADERS` field.
So add this to `HTTP HEADERS` field:
```graphql
{
    "Authorization": "Bearer"
}
 ```

and paste the `token` right behind `Bearer`.

```graphql
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzYxNTY1NWY3YTdlZDFiYzRjYWMxMjMiLCJ1c2VybmFtZSI6IlNlYW4iLCJlbWFpbCI6InNlYW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTQ5ODgyOTgzLCJleHAiOjE1NDk5NjkzODN9.6KZsZuwLDU38tW6zW-hS3jGXlz5dOCxYT_VfVx2iSlI"
}
 ```
 
 Now you are able to run operations that require authorization.
 
 
 FRIENDLY DISCLAIMER: I DO NOT TAKE ANY RESPONSIBILITY FOR ANY PROBLEMS OR ERRORS THAT MIGHT RESULT FROM REUSING MY CODE BY OTHERS.
