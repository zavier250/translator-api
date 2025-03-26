pipeline {
  agent any

  environment {
    ENV_FILE = credentials('ifa-env-file')
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
          // 注入并复制 .env 文件
          sh 'cp $ENV_FILE .env'

          // ✅ 调试输出 .env 文件内容（建议调试完后删除或注释）
          sh 'echo "========= .env 文件内容如下 ========="'
          sh 'cat .env'
          sh 'echo "===================================="'

          // 启动应用
          sh 'npm run dev'
        }
      }
    }

    stage('Cleanup') {
      steps {
        dir('translator-api') {
          // 删除 .env 文件以确保安全
          sh 'rm -f .env'
          echo '.env 文件已删除'
        }
      }
    }
  }
}

