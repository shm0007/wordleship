const { Server, Origins } = require('boardgame.io/server');
const { Battleshipordle } = require('./Battleshipordle');

const server = Server({
  games: [Battleshipordle],
  origins: [
    "192.168.1.151",
    Origins.LOCALHOST,
  ]
});

server.run(8000);