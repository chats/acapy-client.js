# Setup Guide for Publishing to GitHub Packages

This guide will help you publish your ACA-Py TypeScript client to GitHub Packages (npm registry).

## Prerequisites

1. **GitHub Account** with access to create packages
2. **Node.js** (v18 or higher) and npm installed
3. **Git** repository hosted on GitHub

## Initial Setup

### 1. Update Package Name

Edit `package.json` and replace `@chats` with your GitHub username or organization (already set to "chats"):

```json
{
  "name": "@chats/acapy-client",
  "repository": {
    "type": "git",
    "url": "https://github.com/chats/acapy-client-js.git"
  }
}
```

### 2. Update .npmrc File

Edit `.npmrc` and replace `@chats` with your GitHub username or organization (already set to "chats"):

```
@chats:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "npm publish")
4. Select scopes:
   - `write:packages` (to publish packages)
   - `read:packages` (to download packages)
   - `delete:packages` (optional, to delete packages)
5. Click "Generate token" and **copy the token immediately**

### 4. Configure npm Authentication

Export your GitHub token as an environment variable:

```bash
export GITHUB_TOKEN=your_github_token_here
```

Or add it to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
echo 'export GITHUB_TOKEN=your_github_token_here' >> ~/.zshrc
source ~/.zshrc
```

### 5. Authenticate with GitHub Packages

```bash
npm login --scope=@YOUR-GITHUB-USERNAME --registry=https://npm.pkg.github.com
```

When prompted:
- **Username:** Your GitHub username
- **Password:** Your GitHub Personal Access Token (not your GitHub password!)
- **Email:** Your public email address

## Publishing the Package

### Manual Publishing

1. **Ensure everything is committed:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Run tests and build:**
   ```bash
   npm test
   npm run build
   ```

3. **Publish to GitHub Packages:**
   ```bash
   npm publish
   ```

### Automated Publishing with GitHub Actions

The project includes two GitHub Actions workflows:

#### CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push and pull request
- Tests on Node.js 18 and 20
- Runs linting, tests, and builds

#### Publish Workflow (`.github/workflows/publish.yml`)
- Triggers on GitHub releases
- Automatically publishes to GitHub Packages

To use automated publishing:

1. **Create a GitHub Release:**
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Create a new tag (e.g., `v1.0.0`)
   - Fill in release details
   - Click "Publish release"

2. **The workflow will automatically:**
   - Install dependencies
   - Run tests
   - Build the package
   - Publish to GitHub Packages

## Installing Your Published Package

### For Package Consumers

1. **Create or update `.npmrc` in your project:**
   ```
   @YOUR-GITHUB-USERNAME:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. **Install the package:**
   ```bash
   npm install @YOUR-GITHUB-USERNAME/acapy-client
   ```

3. **Use in your code:**
   ```typescript
   import { ACAcpyClient } from '@YOUR-GITHUB-USERNAME/acapy-client';

   const client = new ACAcpyClient({
     baseUrl: 'http://localhost:8031',
     apiKey: 'your-api-key',
   });
   ```

## Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** version (1.0.0 → 1.0.1): Bug fixes

Update version in `package.json` before publishing:

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

## Troubleshooting

### "You do not have permission to publish"

- Ensure you're authenticated with the correct GitHub account
- Verify your token has `write:packages` scope
- Check that the package name matches your GitHub username/org

### "Package already exists"

- You cannot overwrite a published version
- Increment the version number in `package.json`
- Publish again

### "401 Unauthorized"

- Check that your `GITHUB_TOKEN` environment variable is set
- Verify your token hasn't expired
- Try logging in again with `npm login`

### "404 Not Found" when installing

- Ensure the package name in `.npmrc` matches exactly
- Verify you're authenticated (for private packages)
- Check that the package was actually published

## Making the Package Public vs Private

By default, packages published to GitHub Packages are **private**.

### To make it public:

1. Go to your package on GitHub: `https://github.com/YOUR-USERNAME?tab=packages`
2. Click on your package
3. Click "Package settings"
4. Scroll to "Danger Zone"
5. Click "Change visibility" → "Public"

**Note:** Public packages can be installed by anyone without authentication.

## Best Practices

1. **Always run tests before publishing:**
   ```bash
   npm test
   ```

2. **Update CHANGELOG.md** with changes for each version

3. **Use GitHub Releases** to create tags and trigger automated publishing

4. **Keep your token secure:**
   - Never commit tokens to Git
   - Use environment variables
   - Rotate tokens periodically

5. **Test locally before publishing:**
   ```bash
   npm pack
   # This creates a .tgz file you can test install
   npm install ./chats-acapy-client-1.0.0.tgz
   ```

## Additional Resources

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
