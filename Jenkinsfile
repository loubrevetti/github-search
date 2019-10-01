//TODO: add in test stages and also address tieout issue for int and master deploy
def PACKAGE_JSON
def APP_VERSION
def UPDATED_VERSION
pipeline {
  //setting up agent and global parameters.
  agent {
        node {
            label 'master'
        }
    }
  // trigger: to poll our current git repo for any updates to any branches every minute from monday to friday
  triggers {
        pollSCM('H(0-59)/1 * * * 1-5')
    }
  //end global params
  stages {
    // this stage is where we install the app and also copy in our cert for nexus deployment
    // we also extract our current version of applicaiton form package file
    stage('Setup'){
      steps{
        sh 'yarn cache clean'
        sh 'yarn install --verbose'
        sh "cp ${CERT_FILE} ./"
        script {
          PACKAGE_JSON = readJSON file: './package.json'
          APP_VERSION = PACKAGE_JSON.version
        }
        echo "installing cert for nexus repo"
        echo "Building application: [${APP_NAME}]"
        echo "Building version: [${APP_VERSION}]"
        echo "${APP_NAME} has installed dependencies succesfully"
        echo sh(returnStdout: true, script: 'env')
      }
    }
    // stage will run any linting scripts that our tied into our package file
    stage('Lint') {
      steps {
        sh 'yarn run lint'
        echo "${APP_NAME} has linted succesfully"
      }
    }
    // build stage will run our build script that is related to our branch that is currently running through pipeline
    // it will also integrate the correct .env file associated to branch
    stage('Build'){
      parallel{
        stage("Feature"){
          when{
            expression { BRANCH_NAME ==~ /(?![master|next|int]).*/ }
          }
          steps{
            sh 'yarn run build'
            echo "${APP_NAME} has built successfully"
          }
        }
        stage("Dev"){
          when{
            branch 'next'
          }
          steps{
            sh 'yarn run build:dev'
            echo "${APP_NAME} has built successfully"
          }
        }
        stage("Int"){
          when{
            branch 'int'
          }
          steps{
            sh 'yarn run build:int'
            echo "${APP_NAME} has built successfully"
          }
        }
        stage("Production"){
          when{
            branch 'master'
          }
          steps{
            sh 'yarn run build:production'
            echo "${APP_NAME} has built successfully"
          }
        }
      }
      // will submit both an email notification and a slack notification on the status of our build
      post {
        failure {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
        success {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
        aborted {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
      }
    }
    // creating deploy stage only for our environment branches
    stage('Deploy'){
      when{
        anyOf{
          branch 'next'
          branch 'int'
          branch 'master'
        }
      }
      // kills the deploy for int and master if no one hits the deploy button on blue ocean
      options {
            timeout(time: 5, unit: 'MINUTES')
      }
      stages{
        stage('Dev'){
          when{
            branch 'next'
          }
          steps{
            echo 'deploying to our dev environment'
            sh "bash ./build-docker.sh -b -v ${APP_VERSION}-dev -t -u -p 3000"
          }
        }
        stage('Int'){
          when{
            beforeInput true
            branch 'int'
          }
          input{
            message "${getDeploy('Integration').msg}"
            ok "${getDeploy().btnLabel}"
          }
          steps{
            echo 'deploying to our Integration environment'
            sh "bash ./build-docker.sh -b -v ${APP_VERSION}-int -t -u -p 4020"
          }
        }
        // master or prod is a little different cause here we also auto update the version and create a git tag and submit back to git hub
        stage('Production'){
          when{
            beforeInput true
            branch 'master'
          }
          input{
            message "${getDeploy('Production').msg}"
            ok "${getDeploy().btnLabel}"
            parameters {
                choice(name: 'VERSION_UPGRADE', choices: ['Major', 'Minor', 'Patch'], description: 'Select the bump version')
            }

          }
          steps{
            echo 'deploying to production environment'
            sh "bash ./build-docker.sh -b -v ${APP_VERSION}-production -t -u -p 8080"
            script{
              def versionArray = APP_VERSION.split('\.')
              if(VERSION_UPGRADE == "Major"){
                versionArray[0]++
              }else if(VERSION_UPGRADE == "Minor"){
                versionArray[1]++
              }else{
                versionArray[2]++
              }
              UPDATED_VERSION = versionArray.join('.')
              PACKAGE_JSON.version = UPDATED_VERSION
              writeJSON file: 'package.json', json: PACKAGE_JSON, pretty: 2
            }
            withCredentials([usernamePassword(credentialsId: 'gitHubLogin', passwordVariable: "${GITHUB_PWD}", usernameVariable: "${GITHUB_USER_2}")]) {
                sh 'git config --global user.email lbrevetti@evenfinancial.com'
                sh 'git config --global user.name lbrevetti'
                sh "git add package.json"
                sh "git commit -m \"chore(${APP_NAME}): updating verison of app to ${UPDATED_VERSION}\""
                sh "git push https://${GITHUB_USER_2}:${GITHUB_PWD}@github.com/evenfinancialcloud/${APP_NAME}"
                sh "git tag ${APP_VERSION} --force"
                sh "git push https://${GITHUB_USER_2}:${GITHUB_PWD}@github.com/evenfinancialcloud/${APP_NAME} --tags"
            }

          }
        }
      }
      environment{
        NOTIFICATION_MESSAGE = "${APP_NAME}: build-${BUILD_NUMBER} deployment on ${env.GIT_BRANCH} environment"
        EMAIL_NOTIFICATION_MESSAGE = "${NOTIFICATION_MESSAGE} <a href=${env.BUILD_URL}>Open</a>"
      }
      post{
        failure {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
        success {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
        aborted {
          script{
            slackSend(submitSlackMessage('#evenfinancial-ci-cd',currentBuild.currentResult))
            emailext (submitEmail(currentBuild.currentResult))
          }
        }
      }
    }
  }
  environment {
    APP_NAME = 'git-repo-search'
    APP_USER = 'deploy'
    APP_HOME = "${WORKSPACE}"
    BUILD_HOME = "${APP_HOME}/build"
    CERT_FILE = "/etc/nginx/ssl/nginx.crt"
    //config for stages
    //email vars
    EMAIL_PROVIDERS = getEmailList()
    NOTIFICATION_MESSAGE = "${APP_NAME}: build-${BUILD_NUMBER} on branch ${env.GIT_BRANCH}"
    EMAIL_NOTIFICATION_MESSAGE = "${NOTIFICATION_MESSAGE} <a href=${env.BUILD_URL}>Open</a>"
  }
}

//methods for piplines
def getEmailList(){
  return 'frontend@evenfinancial.com,'+emailextrecipients([
    [$class: 'DevelopersRecipientProvider'],
    [$class: 'RequesterRecipientProvider'],
    [$class:'CulpritsRecipientProvider']
    ]);
}

def getDeploy(envir = null){
  return[
    btnLabel:"Yes, please deploy",
    msg:"Would you like to deploy to the environment of: "+envir
  ]
}

def submitSlackMessage(channelId,state){
  def config = ['SUCCESS':['color':'good', 'message':'Success:'], 'ABORTED':['color':'warning', 'message':'Aborted:'], 'FAILURE':['color':'danger','message':'Failure:']]
  return [channel: channelId, color: config.get(state).color, message: config.get(state).message+": ${NOTIFICATION_MESSAGE} (<${env.BUILD_URL}|Open>)"]
}

def submitEmail(state){
  def config = ['SUCCESS':['style':'background:#6c9d31;', 'message':'Success'], 'ABORTED':['style':'background:#e2d104;', 'message':'Aborted'], 'FAILURE':['style':'background:#e22d04;','message':'Failure']]
  return [subject: "${APP_NAME.toUpperCase()} CI BUILD "+config.get(state).message,
  body:"<div style='"+config.get(state).style+"padding:5px 10px; color:#fff; display:inline-block'>"+config.get(state).message+":</div> ${EMAIL_NOTIFICATION_MESSAGE}",
  to:"${EMAIL_PROVIDERS}"]
}
