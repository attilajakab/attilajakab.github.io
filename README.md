# Tooling and utilities

To run local web server on `localhost:8080`:
```
http-server
```

To convert and resize HEIC and none-HEIC images, place them inside `assets/products/heic/` and run:
```
npm run convert
```

To minify assets (js, css):
```
./node_modules/minify/bin/minify.js assets/js/common.js > assets/js/common.min.js
./node_modules/minify/bin/minify.js assets/css/main.css > assets/css/main.min.css
```