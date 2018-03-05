const fs = require('fs');
const path = require('path');
const express = require('express');

const localDir = process.env.DIST_DIR || 'dist';
const indexFile = process.env.DIST_INDEX_FILE || 'index.html';

const staticPath = path.join(__dirname, '..', localDir);
const app = express();

if (process.env.FORCE_SSL == "true") {
  app.use(function (req, res, next) {
    if (!req.secure && (req.headers['x-forwarded-proto']!='https')) {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.originalUrl);
    } else {
      // request was via https, so do no special handling
      next();
    }
  });
}

app.use(express.static(staticPath, { index: false }));

app.all('*', (req, res, next) => {

  const bundleEnvStr = Object.keys(process.env).reduce((memo, key) => {
    if (/^BUNDLE_/.test(key)) {
      memo += `${memo ? ',' : ''}${key}: ${JSON.stringify(process.env[key])}`;
    }
    return memo;
  }, '');

  const envScriptStr = ['<script>window.ENVIRONMENT={', bundleEnvStr, '}</script>'].join('');

  fs.readFile(path.join(staticPath, indexFile), "utf-8", (err, data) => {
    if (err) return next(404);

    const html = data.replace(/<!-- environment -->/, envScriptStr);

    res.contentType('text/html');
    res.send(html);
  });

});

const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Listening on ${port}`);
  console.log('local dir:', localDir, !!process.env.DIST_DIR ? '(from ENV)' : '' );
  console.log('index file:', indexFile, !!process.env.DIST_INDEX_FILE ? '(from ENV)' : '');
});