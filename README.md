# PIIQUANTE
PIIQUANTE backend 

# Server Developement

Dev code with [JavaScript]
Server creating with [node.js]
Using [Mongoose] for data storage
Using [bcrypt] and [jsonwebtoken] for auth security

# Running

Server runnig on port `3000`, use command line `node server` 

# Commands and API access

Authentication :

Use `/api/auth` for auth access with :

POST `/signup` => signup
POST `/login` => login

Sauces access :

All requests need authentication

Use `/api/sauces` for sauces access with :

GET `/` => find All Sauces
GET `/:id` => find One Sauce
POST `/` => create Sauce
PUT `/:id` => modify Sauce
DELETE `/:id` => delete Sauce
POST `/:id/like` => modify Likes



