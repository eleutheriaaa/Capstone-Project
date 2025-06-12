const path = require('path');
const { addUploadHandler, addRegistrationHandler, loginHandler, getUploadDetailHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/uploads',
    options: {
      payload: {
        allow: 'multipart/form-data',
        parse: true,
        output: 'stream',
        multipart: true,
        maxBytes: 10485760, // optional, batas 10 MB di route ini
      },
    },
    handler: addUploadHandler,
  },
  {
    method: 'POST',
    path: '/registration',
    options: {
      payload: {
        allow: 'application/json',
        parse: true,
        output: 'data',
      },
    },
    handler: addRegistrationHandler,
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      payload: {
        allow: 'application/json',
        parse: true,
        output: 'data',
      },
    },
    handler: loginHandler,
  },
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, 'uploads'), // sesuaikan path folder uploads-mu
        listing: false,
        index: false,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload-detail/{id}',  // bukan lagi /uploads/
    handler: getUploadDetailHandler,
  },
];

module.exports = routes;