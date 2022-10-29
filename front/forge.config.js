module.exports = {
    "packagerConfig": {
        "name": "MLP Perceptron",
        "icon": "./assets/icon.ico",
        "executableName": "MLP Perceptron",
        "extraResource": [
          "assets"
        ]
      },
      "makers": [
        {
          "name": "@electron-forge/maker-squirrel",
          "config": {
            "name": "mlp-electron"
          }
        },
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-deb",
          "config": {}
        },
        {
          "name": "@electron-forge/maker-rpm",
          "config": {}
        }
      ],
      "plugins": [
        [
          "@electron-forge/plugin-webpack",
          {
            "mainConfig": "./webpack.main.config.js",
            "devContentSecurityPolicy": "default-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:* ws://localhost:*;",
            "renderer": {
              "config": "./webpack.renderer.config.js",
              "entryPoints": [
                {
                  "html": "./src/index.html",
                  "js": "./src/renderer.ts",
                  "name": "main_window"
                }
              ]
            }
          }
        ]
      ],
}