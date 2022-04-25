const { Server, Origins } = require('boardgame.io/server');
const { Battleshipordle } = require('./Battleshipordle');

const server = Server({
  games: [Battleshipordle],
  origins: [Origins.LOCALHOST],
});

server.run(8000);