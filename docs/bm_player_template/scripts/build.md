# build.js

## Overview
Documentation for build.js

## File Information
- Path: /Users/ivg/github/bm_player_template/scripts/build.js
- Lines: 287
- Type: javascript

## Code
```js
File Type: javascript

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = require('loglevel');

// Set up logging
log.setLevel('info');

// Configuration
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/
...
```

---
*Documentation generated at 2025-09-01T00:30:13.478Z*


---
*Generated from: /Users/ivg/github/bm_player_template/scripts/build.js*
*Date: 2025-09-01T00:30:13.478Z*