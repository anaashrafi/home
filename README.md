# Modern Portfolio Website

A cutting-edge, responsive portfolio website built with React 19 and Vite, featuring modern design patterns, advanced animations, and comprehensive GitHub Pages deployment support.

## 🚀 Live Demo

Visit the live website: [https://anuragvaidhya.github.io/portfolio](https://anuragvaidhya.github.io/portfolio)

## ✨ New Modern Features

### 🎨 Modern Design System
- **Design Tokens**: CSS custom properties for consistent theming
- **Glassmorphism Effects**: Modern glass-like UI elements with backdrop blur
- **Gradient Backgrounds**: Beautiful gradient overlays and text effects
- **Modern Typography**: Inter and Poppins font families for better readability
- **Advanced Animations**: Staggered animations, fade-ins, and smooth transitions

### 🏗️ Enhanced Components
- **Modern Hero Section**: Redesigned with floating tech bubbles and call-to-action buttons
- **Interactive Project Showcase**: Filterable project grid with hover effects
- **Advanced About Section**: Tabbed interface with skills, achievements, and timeline
- **Modern Contact Form**: Functional contact form with validation and status feedback
- **Enhanced Loading Spinner**: Custom animated loading component

### 📱 GitHub Pages Optimized
- **SPA Routing Support**: Proper client-side routing for GitHub Pages
- **Automated Deployment**: GitHub Actions workflow for seamless deployment
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **Performance Optimized**: Code splitting, lazy loading, and bundle optimization

## 🛠️ Technology Stack

### Frontend
- **React 19**: Concurrent rendering, Suspense and lazy-loaded routes
- **React Router 7**: Client-side routing with lazy-loaded pages
- **Modern CSS**: CSS Grid, Flexbox, custom properties, and animations
- **Font Awesome 7**: Bundled inline SVG icons (only the icons used; see `src/icons.js`)

### Development & Deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting with custom domain support
- **Node.js 26 LTS**: Pinned in `.nvmrc` / `.node-version`
- **Vite 8**: Dev server and production build (output in `build/`)
- **Vitest + Testing Library**: `npm test`
- **ESLint 10**: `npm run lint`

## 📦 Quick Start

### Prerequisites
- Node.js 26 LTS (`nvm use` picks it up from `.nvmrc`)
- npm or yarn package manager
- Git for version control

### Local Development
```bash
# Clone the repository
git clone https://github.com/anuragvaidhya/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Preview the production build locally
npm run preview
```

## 🚀 GitHub Pages Deployment

### Automatic Deployment
The repository includes a GitHub Actions workflow that automatically:
1. Builds the application on every push to main/master
2. Runs tests and quality checks
3. Deploys to GitHub Pages
4. Supports custom domains via CNAME

### Manual Deployment
```bash
# One-time setup
npm install -g gh-pages

# Deploy to GitHub Pages
npm run deploy
```

### Configuration
1. **Repository Settings**: Enable GitHub Pages in repository settings
2. **Custom Domain**: Add CNAME file with your domain (optional)
3. **Environment Variables**: Set PUBLIC_URL in GitHub Actions

## 🎨 Customization Guide

### Personal Information
Update your details in `src/editable-stuff/configurations.json`:
```json
{
  "FirstName": "Your",
  "LastName": "Name",
  "devDesc": "Your professional description",
  "icons": [
    {
      "id": 0,
      "image": "fab fa-github",
      "url": "https://github.com/yourusername"
    }
  ]
}
```

### Styling & Theming
Modify CSS custom properties in `src/styles/modern-design.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --font-family-primary: 'Inter', sans-serif;
  --spacing-xl: 2rem;
}
```

### Content Sections
- **About**: Edit `src/components/modern/AboutSection.jsx`
- **Projects**: Update `src/components/modern/ProjectShowcase.jsx`
- **Contact**: Modify `src/components/modern/ContactSection.jsx`

## 📊 Performance Features

### Optimization
- **Code Splitting**: Lazy loading with React.Suspense
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Image Optimization**: Responsive images and lazy loading
- **CSS Optimization**: Purged unused styles and minification

### Lighthouse Scores
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🔧 Advanced Features

### Modern React Patterns
- **Concurrent Features**: Suspense boundaries and error boundaries
- **Custom Hooks**: Reusable logic for animations and API calls
- **Context API**: Theme and application state management
- **Modern Routing**: Nested routes and route-based code splitting

### Accessibility
- **WCAG 2.1 AA Compliant**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Optimized for assistive technologies
- **Color Contrast**: AAA color contrast ratios

### SEO & Social
- **Meta Tags**: Comprehensive meta tag optimization
- **Open Graph**: Facebook and LinkedIn sharing optimization
- **Twitter Cards**: Twitter sharing with rich previews
- **Structured Data**: JSON-LD for better search engine understanding

## 🚨 Troubleshooting

### Common Issues
1. **Routing on GitHub Pages**: Ensure 404.html is properly configured
2. **Build Failures**: Check Node.js version compatibility
3. **Missing Dependencies**: Run `npm install` after pulling updates
4. **Deployment Issues**: Verify GitHub Pages settings and permissions

### Debug Commands
```bash
# Check build output
npm run build && ls -la build/

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js

# Test production build
npm run serve
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the incredible framework and ecosystem
- **GitHub**: For free hosting and CI/CD capabilities
- **Bootstrap Team**: For the responsive grid system
- **FontAwesome**: For the comprehensive icon library
- **Community**: For inspiration and best practices

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/anuragvaidhya/portfolio/issues)
- **Email**: anurag@example.com
- **LinkedIn**: [linkedin.com/in/anuragvaidhya](https://linkedin.com/in/anuragvaidhya)
- **Website**: [anuragvaidhya.com](https://anuragvaidhya.com)

---

**Built with ❤️ and modern web technologies**

*Last updated: October 2024*