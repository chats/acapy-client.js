# Contributing to ACA-Py Client

Thank you for your interest in contributing to the ACA-Py Client for TypeScript!

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/acapy-client-js.git
   cd acapy-client-js
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow the project's coding standards:
   ```bash
   npm run lint
   npm run format
   ```

3. Write tests for your changes:
   ```bash
   npm test
   ```

4. Build the project to ensure there are no compilation errors:
   ```bash
   npm run build
   ```

5. Commit your changes using conventional commit messages:
   ```bash
   git commit -m "feat: add new feature"
   ```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Generate coverage report: `npm run test:coverage`

## Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint:fix` to automatically fix linting issues
- Run `npm run format` to format your code

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure all tests pass and coverage is maintained
3. Update the CHANGELOG.md following the existing format
4. Create a pull request with a clear title and description
5. Link any related issues in the PR description

## Questions?

Feel free to open an issue for any questions or concerns.
