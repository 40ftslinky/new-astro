# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## other (08/12/24)

- brew update
- brew install nvm
- mkdir ~/.nvm

# after in your ~/.zshrc or in .bash_profile if your use bash shell

**** use this if:
zsh: command not found: npm ****

    export NVM_DIR=~/.nvm
    npm 

# switch between zsh and bash

you can use chsh
    -s /bin/bash
    (to switch to bash)
and
    chsh -s /bin/zsh
    (to switch to zsh)

## Switch to bash

    exec bash

## Switch to zsh

    exec zsh

# nvm latest

nvm install --lts
npm -v

npm run dev

## stop dev

ctrl + c

## update astro

# Recommended:
npx @astrojs/upgrade

# Manual:
npm install astro@latest
pnpm upgrade astro --latest
yarn upgrade astro --latest

### If it’s running, quit the dev server to have access to the terminal (keyboard shortcut: Ctrl + C)

### launch

[http://localhost:4321/]

### notes

GSAP integration

** [https://www.launchfa.st/blog/gsap-astro-view-transitions]

<!-- note -->
<!-- --- -->
import myImage from "../my_image.png";
<!-- --- -->

<!-- GOOD: `src` is the full imported image. -->
<Image src={myImage} alt="Cool image" />

<!-- GOOD: `src` is a URL. -->
<Image src="https://example.com/my_image.png" alt="Cool image" />

<!-- BAD: `src` is an image's `src` path instead of the full image object. -->
<Image src={myImage.src} alt="Cool image" />

<!-- BAD: `src` is a string filepath. -->
<Image src="../my_image.png" alt="Cool image" />