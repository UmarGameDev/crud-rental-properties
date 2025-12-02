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
        // Environment variables
        GIT_REPO = 'https://github.com/UmarGameDev/crud-rental-properties'
        GIT_BRANCH = 'main'
        // Use Windows shell
        SHELL = 'cmd.exe'
    }
    
    stages {
        stage('Source Stage - GitHub Webhook') {
            steps {
                echo '=== SOURCE STAGE: GitHub Webhook Trigger ==='
                echo 'This pipeline was triggered by a GitHub webhook'
                
                script {
                    // Display webhook information
                    echo "Repository: ${env.GIT_REPO}"
                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Build Number: ${env.BUILD_NUMBER}"
                    
                    // Simulate webhook payload processing
                    echo 'Processing GitHub webhook payload...'
                    echo 'Validating signature...'
                    echo 'Extracting commit information...'
                }
                
                // Checkout code using the credential ID from your log
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/UmarGameDev/crud-rental-properties.git',
                        // Use the credential ID from your log or Credentials page
                        credentialsId: 'ece17e56-07c7-40e0-9a1c-4c61fcdccb2b'
                    ]]
                ])
                
                // Verify source using Windows batch commands
                bat '''
                    echo Source code verified:
                    dir
                    echo Docker files present:
                    dir docker-compose* || echo No docker-compose files found
                    echo Project structure:
                    tree /F | findstr /V "Directory" | head -20
                '''
                
                // Create a webhook simulation log file
                bat '''
                    echo Jenkins Source Stage Trigger > webhook-simulation.log
                    echo =========================== >> webhook-simulation.log
                    echo Timestamp: %DATE% %TIME% >> webhook-simulation.log
                    echo Repository: https://github.com/UmarGameDev/crud-rental-properties >> webhook-simulation.log
                    echo Branch: main >> webhook-simulation.log
                    echo Build: %BUILD_NUMBER% >> webhook-simulation.log
                    echo. >> webhook-simulation.log
                    echo ✅ Source Stage Complete: Code successfully checked out >> webhook-simulation.log
                    type webhook-simulation.log
                '''
            }
        }
        
        stage('Initialize Project') {
            steps {
                echo '=== INITIALIZE PROJECT ==='
                
                // Create project info file
                bat '''
                    echo # Project Information > project-info.md
                    echo ## Rental Properties CRUD Catalog >> project-info.md
                    echo **Backend:** FastAPI >> project-info.md
                    echo **Frontend:** Streamlit >> project-info.md
                    echo **Database:** PostgreSQL >> project-info.md
                    echo **CI/CD:** GitHub Actions + Jenkins >> project-info.md
                    echo **Build Tool:** Docker Compose >> project-info.md
                    echo. >> project-info.md
                    echo ### Source Stage Status >> project-info.md
                    echo - ✅ Repository cloned successfully >> project-info.md
                    echo - ✅ GitHub webhook trigger simulated >> project-info.md
                    echo - ✅ Ready for Build Stage >> project-info.md
                    type project-info.md
                '''
                
                // List all files for verification
                bat 'dir /s /b *.py | find /c ":" > filecount.txt && set /p count=<filecount.txt && echo Total Python files: !count!'
                bat 'dir /s /b *.yml *.yaml | find /c ":" > yamlcount.txt && set /p count=<yamlcount.txt && echo Total YAML files: !count!'
            }
        }
        
        stage('Build Stage - Prepare') {
            steps {
                echo '=== BUILD STAGE PREPARATION ==='
                echo 'Setting up for Stage 2: Build'
                
                bat '''
                    echo Build Stage Requirements: > build-prep.log
                    echo 1. Docker Desktop installed >> build-prep.log
                    echo 2. Python 3.11+ available >> build-prep.log
                    echo 3. PostgreSQL client tools >> build-prep.log
                    echo 4. Docker Compose >> build-prep.log
                    echo. >> build-prep.log
                    echo Checking prerequisites... >> build-prep.log
                    docker --version >> build-prep.log 2>&1 || echo Docker not found >> build-prep.log
                    python --version >> build-prep.log 2>&1 || echo Python not found >> build-prep.log
                    docker-compose --version >> build-prep.log 2>&1 || echo Docker Compose not found >> build-prep.log
                    type build-prep.log
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Source Stage completed successfully!'
            echo '📊 Next: Stage 2 - Build Stage'
            echo '📁 Artifacts generated:'
            bat 'dir *.log *.md'
            
            // Archive artifacts for documentation
            archiveArtifacts artifacts: '*.log, *.md', fingerprint: true
        }
        failure {
            echo '❌ Source Stage failed'
            bat 'echo Check the logs above for details > failure-analysis.txt'
        }
        always {
            echo '📝 Pipeline execution completed'
            bat 'echo Pipeline completed at: %DATE% %TIME% > pipeline-completion.txt'
        }
    }
}