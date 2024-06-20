## Installation

Download MM module
```bash
cd ~/MagicMirror/modules # adapt directory if you are using a different one
git clone https://github.com/Foll2/MMM-LTR-303
cd MMM-LTR-303
npm install
```

Test ltr-303 or get `maxLux`
```bash
node i2c.js
```

In  `config/config.js`
```js
{
    module: 'MMM-LTR-303',
    position: "fullscreen_above",
    config: {
        maxLux: 500,
        maxDim: 1,
    }
}
```