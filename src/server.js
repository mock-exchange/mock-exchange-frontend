import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy1 = createProxyMiddleware('/api', {
  target: 'http://localhost:5000',
  changeOrigin: true,
})
const proxy2 = createProxyMiddleware('/foo', {
  target: 'http://localhost:5000',
  changeOrigin: true,
})


polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    proxy1,
    proxy2,
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log('error', err);
  });
