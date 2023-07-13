const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
  const getResource = () => {
    return new Promise(res => {
      fs.readFile("./fs/test.txt", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        res(data);
      })
    })
  }

  ctx.set("Cache-Control", "max-age=10"); // 设置强缓存，过期时间为10s
  ctx.body = await getResource();
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
})
