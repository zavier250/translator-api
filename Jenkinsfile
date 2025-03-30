pipeline {
  agent any

  environment {
    EC2_USER = "ec2-user"
    EC2_HOST = "${INSTANCE_IP}"
    REMOTE_DIR = "/home/ec2-user/translator-api"
    SSH_CREDENTIALS_ID = "ifa-ssh-key"
    // below are .env variables
    PORT = 8000
    // DATABASE_URL = "${DATABASE_URL}"
    API_PREFIX = "/api/v1"
    SWAGGER_DOC_PATH = "/api-docs"
    // JWT_SECRET = "${JWT_SECRET}"
  }

  stages {

    stage('Trust GitHub Host') {
      steps {
        sh 'mkdir -p ~/.ssh && ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts'
      }
    }

    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Transfer Code to EC2') {
      steps {
        sshagent (credentials: ["${SSH_CREDENTIALS_ID}"]) {
          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "rm -rf ${REMOTE_DIR} && mkdir -p ${REMOTE_DIR}"
            scp -o StrictHostKeyChecking=no -r * ${EC2_USER}@${EC2_HOST}:${REMOTE_DIR}/
          """
        }
      }
    }

    stage('Generate .env on EC2') {
      steps {
        sshagent (credentials: ["${SSH_CREDENTIALS_ID}"]) {
          sh """
ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} <<'EOF'
              cd ${REMOTE_DIR}
              echo "PORT=${PORT}" > .env
              echo "DATABASE_URL=\$DATABASE_URL" >> .env
              echo "API_PREFIX=${API_PREFIX}" >> .env
              echo "SWAGGER_DOC_PATH=${SWAGGER_DOC_PATH}" >> .env
              echo "JWT_SECRET=\$JWT_SECRET" >> .env
EOF
          """
        }
      }
    }

    stage('Start App on EC2') {
      steps {
        sshagent (credentials: ["${SSH_CREDENTIALS_ID}"]) {
          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
              cd ${REMOTE_DIR} &&
              npm install &&
              pm2 delete ifa-backend || true &&
              pm2 start npm --name "ifa-backend" -- run dev &&
              pm2 save
            '
          """
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deployment to EC2 completed successfully!'
    }
    failure {
      echo '❌ Deployment failed. Please check the logs.'
    }
  }
}
