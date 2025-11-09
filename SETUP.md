# EduTrack Frontend - Setup Guide

## Prerequisites
- Node.js 18+
- npm or yarn

## Initial Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/edutrack-fe.git
cd edutrack-fe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API endpoints

**Option A: Using environment variables (Recommended for production)**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=http://your-backend-url/api
```

**Option B: Using api.ts directly (For local development)**
```bash
# Copy the example configuration
cp src/config/api.example.ts src/config/api.ts

# Edit src/config/api.ts and configure your API URLs
```

### 4. Run development server
```bash
npm run dev
```

## Deployment Setup

### Jenkins Pipeline
If you're using Jenkins for CI/CD:

1. Copy the Jenkinsfile template:
```bash
cp Jenkinsfile.example Jenkinsfile
```

2. Edit `Jenkinsfile` and configure:
   - `GITHUB_CREDENTIAL_ID`: Your GitHub credentials ID in Jenkins
   - `SSH_CREDENTIAL_ID`: Your SSH credentials ID in Jenkins
   - `DEPLOY_DIR`: Deployment directory on your server
   - `REMOTE_USER`: SSH user for deployment
   - `REMOTE_HOST`: Your server IP or domain
   - `SSH_PORT`: SSH port (default: 22)

3. **Important**: Keep `Jenkinsfile` and `src/config/api.ts` in `.gitignore` to prevent exposing sensitive data

## Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

## Project Structure
```
edutrack-fe/
├── src/
│   ├── config/
│   │   ├── api.example.ts    # Template for API configuration
│   │   └── api.ts            # Your actual API config (gitignored)
│   └── ...
├── .env.example              # Template for environment variables
├── .env                      # Your actual env vars (gitignored)
├── Jenkinsfile.example       # Template for Jenkins pipeline
├── Jenkinsfile               # Your actual Jenkins config (gitignored)
└── ...
```

## Security Notes
- Never commit `Jenkinsfile`, `src/config/api.ts`, or `.env` files
- These files contain sensitive information like server IPs and credentials
- Always use the `.example` files as templates
