pipeline {
  agent {
    docker { image 'nocde:18-alpine' }
  }
  environment {
    APP_DIR = "inventory-api_"
    IMAGE_NAME = "inventory-api"
    BR = "${env.BRANCH_NAME ?: 'unknown'}"
  }
  stages {
    stage('Checkout') {
      steps {
        echo "Building branch: ${env.BRANCH_NAME}"
        checkout scm
      }
    }

    stage('Build') {
      steps {
        dir("${APP_DIR}") {
          echo "==> [${env.BRANCH_NAME}] Installing dependencies"
          sh 'npm ci || npm install'
          echo "==> [${env.BRANCH_NAME}] Building Docker image (local)"
          // tag image uniquely per branch
          sh """
            docker build -t ${IMAGE_NAME}:${BR} .
          """
          sh "docker images | grep ${IMAGE_NAME} || true"
        }
      }
    }

    stage('Test') {
      steps {
        dir("${APP_DIR}") {
          echo "==> [${env.BRANCH_NAME}] Running tests"
          sh 'npm test'
        }
      }
    }

    stage('Deploy') {
      steps {
        dir("${APP_DIR}") {
          echo "==> [${env.BRANCH_NAME}] Deploying (local docker run)"
          // stop existing container if any and run new one on branch-specific port
          script {
            def portMap = ['dev':'3000','feature-api':'3001','feature-ui':'3002']
            def port = portMap.containsKey(env.BRANCH_NAME) ? portMap[env.BRANCH_NAME] : '3100'
            sh """
              docker rm -f ${IMAGE_NAME}-${BR} 2>/dev/null || true
              docker run -d --name ${IMAGE_NAME}-${BR} -p ${port}:3000 ${IMAGE_NAME}:${BR}
            """
            echo "App should be reachable at http://<jenkins-host>:${port} (if docker host permits)"
          }
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finished for branch ${env.BRANCH_NAME}"
      // show images for debugging
      sh 'docker images | head -n 20 || true'
    }
    failure {
      echo "Pipeline failed for branch ${env.BRANCH_NAME}"
    }
  }
}
