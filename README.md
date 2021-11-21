# microservice blog app

This is a basic blog application, built with a microservice architecture and a basic event bus built from scratch.
All data is stored in memory.

## How to run

To run the application, start up the client, CommentsService, PostsService, QueryService, ModerationService and Event Bus with ```npm start``` inside of their respective folders.

## Unique feature
The blog has a built in service called ModerationService, which automatically rejects comments to Posts, which contain a specific word. By default it is the word 'orange'. Yes this is useless (gonna work on customizing this moderation later).
