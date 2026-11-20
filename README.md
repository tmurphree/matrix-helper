# matrix-helper

Avoid manual errors when doing matrix operations.

# Project status — in progress
The app works but is not finished. I made the repository public so you can see an up-to-date example of how I write code.

# Project Summary
Nuxt web app for guided matrix work: find a matrix inverse, reduce to reduced row echelon form (RREF), and apply row operations with a step-by-step history (stored in the browser) so you can see how the matrix changed at each step.

# Problem Solved
Matrix work is easy to get wrong by hand. I discovered that while working with one of my children on matrix problems until 1 AM one day.

This tool runs the operations for you so you can focus on the strategy of inverting the matrix or getting it to reduced row echelon form without worrying if you dropped a negative sign or mis-added somewhere.

# Project setup
```
npm install
```

## Development server
```
npm run dev
```

## Production build
```
npm run build
```

## Preview production build
```
npm run preview
```

## Unit tests
```
npm run test
```

This repo includes a dev container (Node version pinned in `package.json`). Open the folder in Cursor or VS Code and use **Dev Containers: Reopen in Container**, then run the commands above inside the container.

Deployment options are described in the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

# Technologies Used
* Nuxt
* Vue 3 (Composition API)
* TypeScript
* Vitest
* ESLint and Prettier

# Libraries & Plugins
* Bootstrap
