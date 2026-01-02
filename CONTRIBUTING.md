# Contributing to SignConnect

Thank you for your interest in contributing to SignConnect! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/signconnect/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant examples or mockups

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/signconnect.git
   cd signconnect
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # Frontend
   cd frontend
   npm test
   npm run build
   
   # Backend
   cd backend
   npm test
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

## Development Guidelines

### Code Style

**TypeScript/JavaScript:**
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**React:**
- Use functional components with hooks
- Keep components small and reusable
- Use proper prop types
- Follow React best practices

**CSS:**
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic class names

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add screen sharing functionality
fix: resolve WebRTC connection issue
docs: update API documentation
```

### Testing

- Write unit tests for utilities and helpers
- Write integration tests for API endpoints
- Test UI components with React Testing Library
- Ensure all tests pass before submitting PR

### Documentation

- Update README.md if adding features
- Add JSDoc comments for functions
- Update API documentation for new endpoints
- Include inline comments for complex code

## Project Structure

```
signconnect/
├── frontend/          # React application
├── backend/           # Node.js server
├── shared/           # Shared types
├── docs/             # Documentation
└── tests/            # Test files
```

## Getting Help

- Join our [Discord community](https://discord.gg/signconnect)
- Check [documentation](docs/)
- Ask questions in [Discussions](https://github.com/yourusername/signconnect/discussions)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

Thank you for contributing to SignConnect! 🎉
