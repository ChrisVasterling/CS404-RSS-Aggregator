# CS404-RSS-Aggregator
My Final Project for CS-404 Adv. Web &amp; Internet Programming is a React+MUI+Electron RSS Aggregator


## Get Started
- Ensure you have node installed (tested with v18.8.0)
- Download/Clone the repo and navigate to the root folder in a terminal
- Run `npm i` to install all dependencies
- There are a few options to get the program running:
  - `npm start` builds the react application using esbuild and launches it in electron
  - `npm run client` uses esbuild to create a production, minified, build
  - `npm run client:dev` uses esbuild to create a development build (and rebuild on any changes)
  - `npm run electron` will launch the electron app using the most recent build
  - `npm run electron:stay` is useful in development as it relaunches the program if accidentally closed

## Learning Opportunities
- Setting up ESLint for use with typescript
- Using electron's `contextBridge` and `ipcRenderer` to setup a line of bidirectional communication between the front-end and electron's node environment
  - This was needed since the `rss-parser` library must run in a node environment rather than client side
- Knowing when the break down a piece of UI into its own component
- Working with types and ensuring types match
