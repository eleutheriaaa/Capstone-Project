const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const connectDB = require('./db');
 
const init = async () => {
  const server = Hapi.server({
    port: 7000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
      payload: {
        maxBytes: 10485760, // max 10 MB
        output: 'stream',
        parse: true,
        multipart: true,
      },
    },
  });

  await server.register(require('@hapi/inert'));

  await connectDB();
  server.route(routes);
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();