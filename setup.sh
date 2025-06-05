#!/usr/bin/env zsh

# Setup script for Phoenix Protocol frontend development

# Ensure we have the right Node.js version
if command -v nvm &> /dev/null; then
  echo "📦 Setting up Node.js version..."
  nvm use
else
  echo "⚠️ nvm not found. Please install nvm or use Node.js version specified in .nvmrc"
  echo "Current Node.js version: $(node -v)"
  echo "Required Node.js version: $(cat .nvmrc)"
fi

# Create local env file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local file..."
  cp .env.example .env.local
  echo "✅ Created .env.local file. Please update it with your configuration."
else
  echo "✅ .env.local file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build packages
echo "🔨 Building required packages..."
yarn build:types
yarn build:utils
yarn build:contracts
yarn build:state

echo "🚀 Setup complete! You can now run 'yarn dev' to start development."
