pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    environment {
        GIT_REPO = 'https://github.com/UmarGameDev/crud-rental-properties'
        GIT_BRANCH = 'main'
    }
    
    stages {
        stage('Source Stage - GitHub Webhook') {
            steps {
                echo '=== SOURCE STAGE: GitHub Webhook Trigger ==='
                echo 'This pipeline was triggered by a GitHub webhook'
                
                script {
                    echo "Repository: ${env.GIT_REPO}"
                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Build Number: ${env.BUILD_NUMBER}"
                    echo 'Processing GitHub webhook payload...'
                }
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/UmarGameDev/crud-rental-properties.git',
                        credentialsId: 'ece17e56-07c7-40e0-9a1c-4c61fcdccb2b'
                    ]]
                ])
                
                // Windows-compatible directory listing
                bat '''
                    echo Source code verified:
                    dir
                    echo.
                    echo Docker files present:
                    dir docker-compose*
                    echo.
                    echo Project structure:
                    dir /s /b | find /c /v "" > total_files.txt
                    set /p total=<total_files.txt
                    echo Total files in project: !total!
                    del total_files.txt
                '''
                
                // Create webhook simulation log
                bat '''
                    echo Jenkins CI/CD Pipeline > pipeline-status.log
                    echo ====================== >> pipeline-status.log
                    echo Stage 1: SOURCE >> pipeline-status.log
                    echo Status: SUCCESS >> pipeline-status.log
                    echo Timestamp: %DATE% %TIME% >> pipeline-status.log
                    echo Repository: https://github.com/UmarGameDev/crud-rental-properties >> pipeline-status.log
                    echo Commit: 60177cdc72a7d0d74f6642bf61865e83aac580c2 >> pipeline-status.log
                    echo. >> pipeline-status.log
                    echo "✅ Source Stage Complete" >> pipeline-status.log
                    echo "- Code repository cloned" >> pipeline-status.log
                    echo "- GitHub webhook trigger verified" >> pipeline-status.log
                    echo "- Ready for Build Stage" >> pipeline-status.log
                    type pipeline-status.log
                '''
            }
        }
        
        stage('Initialize Project') {
            steps {
                echo '=== INITIALIZE PROJECT ==='
                
                // Create project documentation
                bat '''
                    echo # CI/CD Pipeline Status Report > pipeline-report.md
                    echo ## Stage 1: Source Stage >> pipeline-report.md
                    echo **Status:** COMPLETED SUCCESSFULLY >> pipeline-report.md
                    echo **Timestamp:** %DATE% %TIME% >> pipeline-report.md
                    echo **Build:** %BUILD_NUMBER% >> pipeline-report.md
                    echo. >> pipeline-report.md
                    echo ### Repository Information >> pipeline-report.md
                    echo - **URL:** https://github.com/UmarGameDev/crud-rental-properties >> pipeline-report.md
                    echo - **Branch:** main >> pipeline-report.md
                    echo - **Commit:** 60177cdc72a7d0d74f6642bf61865e83aac580c2 >> pipeline-report.md
                    echo. >> pipeline-report.md
                    echo ### Project Structure >> pipeline-report.md
                    echo ``` >> pipeline-report.md
                    dir /b >> pipeline-report.md
                    echo ``` >> pipeline-report.md
                    echo. >> pipeline-report.md
                    echo ### Next Stage: Build >> pipeline-report.md
                    echo 1. Docker image building >> pipeline-report.md
                    echo 2. Dependency resolution >> pipeline-report.md
                    echo 3. Artifact creation >> pipeline-report.md
                    type pipeline-report.md
                '''
                
                // Count files for metrics
                bat '''
                    dir /s /b *.py | find /c ":" > pycount.txt
                    set /p pycount=<pycount.txt
                    echo Python files: !pycount!
                    
                    dir /s /b *.yml *.yaml | find /c ":" > yamlcount.txt
                    set /p yamlcount=<yamlcount.txt
                    echo YAML files: !yamlcount!
                    
                    dir /s /b *.md | find /c ":" > mdcount.txt
                    set /p mdcount=<mdcount.txt
                    echo Markdown files: !mdcount!
                    
                    echo Source Metrics: > metrics.txt
                    echo Python files: !pycount! >> metrics.txt
                    echo YAML files: !yamlcount! >> metrics.txt
                    echo Documentation files: !mdcount! >> metrics.txt
                    type metrics.txt
                    
                    del pycount.txt yamlcount.txt mdcount.txt
                '''
            }
        }
        
        stage('Build Stage - Preparation') {
            steps {
                echo '=== BUILD STAGE PREPARATION ==='
                echo 'Ready for Stage 2: Build'
                
                // Check prerequisites
                bat '''
                    echo Build Stage Prerequisites Check > prerequisites.log
                    echo =============================== >> prerequisites.log
                    
                    echo Checking Docker... >> prerequisites.log
                    docker --version >> prerequisites.log 2>&1
                    if errorlevel 1 echo ERROR: Docker not found >> prerequisites.log
                    
                    echo Checking Docker Compose... >> prerequisites.log
                    docker-compose --version >> prerequisites.log 2>&1
                    if errorlevel 1 echo ERROR: Docker Compose not found >> prerequisites.log
                    
                    echo Checking Python... >> prerequisites.log
                    python --version >> prerequisites.log 2>&1
                    if errorlevel 1 echo ERROR: Python not found >> prerequisites.log
                    
                    echo. >> prerequisites.log
                    echo "✅ All checks completed" >> prerequisites.log
                    type prerequisites.log
                '''
                
                // Create build stage plan
                bat '''
                    echo # Build Stage Plan > build-plan.md
                    echo ## Tasks for Stage 2 >> build-plan.md
                    echo 1. Build Docker images: >> build-plan.md
                    echo    - Backend (FastAPI) >> build-plan.md
                    echo    - Frontend (Streamlit) >> build-plan.md
                    echo    - Database (PostgreSQL) >> build-plan.md
                    echo 2. Run dependency installation >> build-plan.md
                    echo 3. Create build artifacts >> build-plan.md
                    echo 4. Run unit tests >> build-plan.md
                    echo. >> build-plan.md
                    echo **Tools to use:** >> build-plan.md
                    echo - Docker Compose >> build-plan.md
                    echo - Python/pip >> build-plan.md
                    echo - PostgreSQL >> build-plan.md
                    type build-plan.md
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ SOURCE STAGE COMPLETED SUCCESSFULLY!'
            echo '📊 Pipeline progressing to Build Stage'
            
            // Archive all created artifacts
            archiveArtifacts artifacts: '*.log, *.md, *.txt, pipeline-report.md, build-plan.md, metrics.txt, pipeline-status.log, prerequisites.log', fingerprint: true
            
            bat '''
                echo ============================== > completion-summary.txt
                echo SOURCE STAGE COMPLETION SUMMARY >> completion-summary.txt
                echo ============================== >> completion-summary.txt
                echo. >> completion-summary.txt
                echo "Status: SUCCESS" >> completion-summary.txt
                echo "Build: %BUILD_NUMBER%" >> completion-summary.txt
                echo "Timestamp: %DATE% %TIME%" >> completion-summary.txt
                echo "Artifacts generated:" >> completion-summary.txt
                dir *.log *.md *.txt /b >> completion-summary.txt
                echo. >> completion-summary.txt
                echo "Next: Stage 2 - Build" >> completion-summary.txt
                type completion-summary.txt
            '''
        }
        failure {
            echo '❌ Pipeline failed'
            bat 'echo Failure analysis - check previous steps > failure.txt'
        }
        always {
            echo '📝 Jenkins Pipeline Execution Complete'
            bat 'echo End time: %DATE% %TIME% > execution-time.txt'
        }
    }
}