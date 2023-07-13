const Koa = require("koa");
const Router = require("@koa/router");
const fs = require("fs");

const app = new Koa();
const router = new Router();

// * 强缓存 demo
router.get("/", async ctx => {
  const getResource = () => {
    return new Promise(res => {
      fs.readFile("./fs/test.txt", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        res(data);
      });
    });
  };

  ctx.set("Cache-Control", "max-age=10"); // 设置强缓存，过期时间为10s
  ctx.body = await getResource();
});

// * 协商缓存 demo
router.get("/test", async ctx => {
  const isModifiedSince = ctx.request.header["if-modified-since"];
  const getResource = () => {
    return new Promise(res => {
      fs.stat("./fs/test.txt", (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        res(stats);
      })
    })
  }

  let resource = await getResource();
  // atime    Access Time 访问时间
  // 最后一次访问文件（读取或执行）的时间
  // ctime    Change Time 变化时间
  // 最后一次改变文件（属性或权限）或者目录（属性或权限）的时间
  // mtime    Modify Time 修改时间
  // 最后一次修改文件（内容）或者目录（内容）的时间
  if (isModifiedSince === resource.mtime.toGMTString()) {
    ctx.status = 304;
  }
  ctx.set("Last-Modified", resource.mtime.toGMTString());
  ctx.body = resource;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
