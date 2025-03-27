pipeline {
  agent any

  environment {
    ENV_FILE = credentials('ifa-env-file')   // 注入 .env 文件路径
  }

  stages {
    stage('Install') {
      steps {
        dir('translator-api') {
          sh 'npm install'
        }
      }
    }

    stage('Run') {
      steps {
        dir('translator-api') {
          sh 'chmod u+w .'
          sh 'cp $ENV_FILE .env'
          sh 'echo ========= .env 文件内容如下 ========='
          sh 'cat .env'
          sh 'echo ===================================='
          sh 'cat .env | xargs export && npm run dev &'
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ['ifa-ec2-key']) {
          sh '''
            ssh -o StrictHostKeyChecking=no ec2-user@54.227.29.184 << EOF
              cd translator-api
              git pull origin devops-Rocky
              npm install
              pm2 restart translator || pm2 start index.ts --interpreter ts-node --name translator
            EOF
          '''
        }
      }
    }
  }
}
