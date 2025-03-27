pipeline {
  agent any

  environment {
    ENV_FILE = credentials('ifa-env-file') // 注入 .env 文件
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
            ssh -o StrictHostKeyChecking=no ec2-user@54.227.29.184 <<EOF
cd ~/translator-api
echo "📦 拉取最新代码..."
git pull origin devops-Rocky

echo "📦 安装依赖..."
npm install

echo "🚀 启动/重启 PM2 服务..."
pm2 restart translator || pm2 start index.ts --interpreter $(which ts-node) --name translator

echo "🔍 当前 PM2 状态："
pm2 status
EOF
          '''
        }
      }
    }
  }
}
