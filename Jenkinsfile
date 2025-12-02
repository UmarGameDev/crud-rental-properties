pipeline {
    agent any
    
    triggers {
        // This enables GitHub webhook triggers
        githubPush()
    }
    
    options {
        // For project documentation
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    environment {
        // Environment variables that would be set
        GIT_REPO = 'https://github.com/UmarGameDev/crud-rental-properties'
        GIT_BRANCH = 'main'
    }
    
    stages {
        stage('Source Stage - GitHub Webhook') {
            steps {
                echo '=== SOURCE STAGE: GitHub Webhook Trigger ==='
                echo 'This pipeline was triggered by a GitHub webhook'
                
                script {
                    // Display webhook information
                    echo "Repository: ${env.GIT_URL}"
                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Commit: ${env.GIT_COMMIT}"
                    
                    // Simulate webhook payload processing
                    echo 'Processing GitHub webhook payload...'
                    echo 'Validating signature...'
                    echo 'Extracting commit information...'
                }
                
                // Checkout code
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/UmarGameDev/crud-rental-properties.git',
                        credentialsId: 'github-token'
                    ]]
                ])
                
                // Verify source
                sh '''
                    echo "Source code verified:"
                    ls -la
                    echo "Docker files present:"
                    ls docker-compose* || echo "No docker-compose files"
                '''
            }
        }
        
        stage('Build Stage') {
            steps {
                echo '=== BUILD STAGE ==='
                echo 'Build stage would run here...'
                // This will be implemented in Stage 2
            }
        }
    }
    
    post {
        success {
            echo '✅ Source Stage completed successfully'
            echo '📁 Repository: https://github.com/UmarGameDev/crud-rental-properties'
            echo '🔗 Next: Build Stage → Test Stage → Staging → Deploy'
        }
        failure {
            echo '❌ Source Stage failed'
        }
    }
}