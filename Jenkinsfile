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

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ['ifa-ec2-key']) {
          sh '''
            echo "🚀 正在将 .env 同步到 EC2..."
            scp -o StrictHostKeyChecking=no $ENV_FILE ec2-user@54.227.29.184:~/translator-api/.env

            echo "🔧 正在连接 EC2 执行部署命令..."
            ssh -o StrictHostKeyChecking=no ec2-user@54.227.29.184 << EOF
              cd translator-api
              git pull origin devops-Rocky
              npm install

              echo "🔄 使用 PM2 启动或重启服务..."
              pm2 restart translator || pm2 start index.ts --interpreter ts-node --name translator

              echo "✅ 当前 PM2 状态如下："
              pm2 status
            EOF
          '''
        }
      }
    }
  }
}
