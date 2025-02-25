# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b1ba0359-c9cf-4160-8339-3a27113f635a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b1ba0359-c9cf-4160-8339-3a27113f635a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Live Site

Visit the live site at: `https://nolijedi.github.io/click-nova/`

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages. Here's how it works:

1. The project is built using Vite and configured to work with GitHub Pages
2. When you push to the `main` branch, GitHub Actions automatically:
   - Builds the project
   - Deploys it to GitHub Pages

To view the live site:

1. Go to your repository settings
2. Navigate to "Pages" under "Code and automation"
3. Make sure:
   - Source is set to "Deploy from a branch"
   - Branch is set to "gh-pages" and "/(root)"
4. Your site is available at:
   `https://nolijedi.github.io/click-nova/`

### Manual Deployment

If you need to deploy manually:

```sh
# Build the project
npm run build

# Deploy to GitHub Pages
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b1ba0359-c9cf-4160-8339-3a27113f635a) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
