#!/bin/bash

# Build Script for Rental Properties CRUD
# Used by GitHub Actions CI/CD Pipeline

set -e  # Exit on error

echo "🔨 Starting Build Stage"
echo "======================"

# Get commit SHA for tagging
COMMIT_SHA=${GITHUB_SHA:0:8}
echo "Build for commit: $COMMIT_SHA"

# Step 1: Check environment
echo "1. Checking build environment..."
docker --version
docker-compose --version
python --version

# Step 2: Build backend
echo "2. Building Backend (FastAPI)..."
cd backend
docker build -t crud-backend:$COMMIT_SHA -t crud-backend:latest .
cd ..

# Step 3: Build frontend
echo "3. Building Frontend (Streamlit)..."
cd frontend
docker build -t crud-frontend:$COMMIT_SHA -t crud-frontend:latest .
cd ..

# Step 4: Verify builds
echo "4. Verifying Docker images..."
docker images | grep -E "(crud-backend|crud-frontend)"

# Step 5: Save images as artifacts
echo "5. Creating build artifacts..."
docker save -o backend-image-$COMMIT_SHA.tar crud-backend:$COMMIT_SHA
docker save -o frontend-image-$COMMIT_SHA.tar crud-frontend:$COMMIT_SHA

# Step 6: Create build info
echo "6. Generating build report..."
cat > build-info.json << EOF
{
  "build_id": "$GITHUB_RUN_ID",
  "commit_sha": "$COMMIT_SHA",
  "timestamp": "$(date -Iseconds)",
  "images": [
    {
      "name": "crud-backend",
      "tag": "$COMMIT_SHA",
      "size": "$(docker images --format "{{.Size}}" crud-backend:$COMMIT_SHA)"
    },
    {
      "name": "crud-frontend",
      "tag": "$COMMIT_SHA",
      "size": "$(docker images --format "{{.Size}}" crud-frontend:$COMMIT_SHA)"
    }
  ]
}
EOF

echo "✅ Build Stage Completed Successfully!"
echo "📦 Artifacts created:"
ls -la *.tar
echo "📝 Build info: build-info.json"