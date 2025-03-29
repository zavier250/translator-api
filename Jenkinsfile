pipeline {
  agent any

  environment {
    ENV_FILE = credentials('ifa-env-file') // 注入 .env 文件（隐藏）
  }

  stages {
    stage('Install') {
      steps {
        dir('translator-api') {
          echo '📦 正在安装依赖...'
          sh 'npm install'
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ['ifa-ec2-key']) {
          sh '''
            echo "🚀 正在将 .env 同步到 EC2..."
            scp -o StrictHostKeyChecking=no "$ENV_FILE" ec2-user@54.227.29.184:~/translator-api/.env

            echo "🔧 正在连接 EC2 执行部署命令..."

            ssh -o StrictHostKeyChecking=no ec2-user@54.227.29.184 "
              cd ~/translator-api &&
              echo 📦 拉取最新代码... &&
              git pull origin devops-Rocky &&
              echo 📦 安装依赖... &&
              npm install &&
              echo 🚀 清理旧的 PM2 实例...
              pm2 delete all || true
              echo 🚀 启动 PM2 服务（使用 ts-node/esm）...
              pm2 start index.ts \\
                --name translator \\
                --interpreter $(npm root -g)/ts-node/dist/bin.js \\
                --node-args="--loader ts-node/esm --experimental-specifier-resolution=node --require tsconfig-paths/register"
              echo 💾 保存 PM2 状态（开机自启）... &&
              pm2 save &&
              echo 🔍 当前 PM2 状态： &&
              pm2 list
            "
          '''
        }
      }
    }
  }
}
