const { Server, Origins } = require('boardgame.io/server');
import path from 'path';
import serve from 'koa-static';
const { Battleshipordle } = require('./Battleshipordle');

const server = Server({ games: [Battleshipordle] });
const PORT = process.env.PORT || 8000;

//buld path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT, () => {
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath) (
      Object.assign(ctx, {path: 'index.html'}),
      next
    )
  )
});