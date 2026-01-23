# Deployment Guide - Estación Óptica v3.0

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm start
```

**URLs:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

---

## 📦 Production Deployment

### Option 1: Netlify (Frontend) + Railway (Backend)

#### Frontend (Netlify)
1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` folder to Netlify

3. Add `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Backend (Railway)
1. Create new project on Railway
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000`
4. Deploy from `main` branch

---

### Option 2: Render (Full Stack)

1. Create Web Service for backend
2. Create Static Site for frontend
3. Configure environment variables
4. Auto-deploy on push

---

## 🗄️ MongoDB Setup

### Local
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

### Cloud (MongoDB Atlas)
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Enable CORS only for production domain
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Rate limit API endpoints
- [ ] Validate all inputs
- [ ] Sanitize user data

---

## 📊 Monitoring

### Recommended Tools
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Uptime Robot** - Server monitoring

---

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

**¡Listo para desplegar!** 🎉
