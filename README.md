# matrix-helper

Avoid manual errors when doing matrix operations.

Photo by <a href="https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Spiske</a> on <a href="https://unsplash.com/photos/matrix-movie-still-iar-afB0QQw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>


# Development server
The project uses a development container for a consistent Node.js environment.

## Open the project in the container
Use Cursor or VS Code with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers):

* Open this repository in the editor.
* Run **Dev Containers: Reopen in Container** from the Command Palette, or accept the **Reopen in Container** prompt.
* Wait until the container is started.

## Access the app from Windows
Compose publishes container port **3000** to the host. After you change `.devcontainer/docker-compose.yml`, run **Dev Containers: Rebuild Container** so Docker picks up the new mapping.

With `npm run dev` running inside the container, open **http://localhost:3000/** in a browser on the host. You can also use the editor **Ports** panel if it forwards 3000. If something else already uses port 3000 on the host, change the left side of the mapping in [`.devcontainer/docker-compose.yml`](.devcontainer/docker-compose.yml) (for example `3001:3000`) and use that port in the URL instead.

In a terminal:
```bash
wsl
# This gets you a shell in the container.
cd to the project directory
docker exec -it matrix-helper-dev bash
npm run dev
```

Then wait for a while until you can see the site in a browser in Windows.

# Production

Build the application for production:
```bash
npm run build
```

Locally preview the production build:
```bash
npm run preview
```

See the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
