### requirements for local development
- docker
- bun (node run time environment)


### project setup in docker workspace
```shell
docker run --rm -it -v $(pwd):/home/bun/app \
  oven/bun:1.0.3-debian \
  bun install --no-save
```

### clearup
```shell
rm -rf ./backend-bun-hono/node_modules
```

### test
```shell
docker run --rm -it -v $(pwd):/home/bun/app \
  oven/bun:1.0.3-debian \
  bun test
```
