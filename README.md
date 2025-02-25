# Click Nova

Click Nova is a next-generation system optimization suite with cyberpunk aesthetics. It provides powerful system optimization tools with a beautiful, modern interface.

## Features

- System Optimization
- Performance Monitoring
- Cache Cleanup
- Drive Optimization
- Beautiful Cyberpunk UI
- Real-time Performance Metrics

## Tech Stack

- React
- Vite
- TypeScript
- shadcn-ui
- Tailwind CSS

## Live Site

Visit the live site at: `https://nolijedi.github.io/click-nova/`

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages. Here's how it works:

1. Push changes to the main branch
2. GitHub Actions will automatically build and deploy to gh-pages
3. Make sure:
   - Source is set to "Deploy from a branch"
   - Branch is set to "gh-pages" and "/(root)"
4. Your site is available at:
   `https://nolijedi.github.io/click-nova/`

### Manual Deployment

If you need to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

3. Deploy the contents of the `dist` directory to your hosting service

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## License

MIT License
