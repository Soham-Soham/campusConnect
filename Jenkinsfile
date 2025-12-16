pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        APP_NAME        = "campus-connect"
        IMAGE_TAG       = "latest"
        // Using the internal service URL from the reference
        REGISTRY_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        // Assuming your repository is named after your ID, similar to the reference
        REGISTRY_REPO   = "2401137" 
        SONAR_PROJECT   = "2401137_CampusConnect"
        // Using the internal service URL for SonarQube from the reference
        SONAR_HOST_URL  = "http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        # Mapping your directories (Backend/Frontend) to image names
                        docker build -t server:$IMAGE_TAG ./Backend
                        docker build -t client:$IMAGE_TAG ./Frontend
                        docker images
                    '''
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                container('dind') {
                    sh '''
                         echo "Running tests... (Add actual test commands here if available)"
                         # Example: docker run --rm server:$IMAGE_TAG npm test
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([
                        string(credentialsId: 'sonar-token-2401137', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=$SONAR_PROJECT \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**
                        '''
                    }
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login $REGISTRY_URL -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:$IMAGE_TAG $REGISTRY_URL/$REGISTRY_REPO/server:$IMAGE_TAG
                        docker tag client:$IMAGE_TAG $REGISTRY_URL/$REGISTRY_REPO/client:$IMAGE_TAG

                        docker push $REGISTRY_URL/$REGISTRY_REPO/server:$IMAGE_TAG
                        docker push $REGISTRY_URL/$REGISTRY_REPO/client:$IMAGE_TAG
                        
                        docker images
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    withCredentials([
                        file(credentialsId: 'campus-connect-env-file', variable: 'ENV_FILE_PATH')
                    ]) {
                        dir('k8s') {
                            sh '''
                                # Ensure Namespace exists
                                kubectl get namespace 2401137 || kubectl create namespace 2401137

                                # Create Secrets (Dry-run to allow updates)
                                kubectl create secret docker-registry nexus-secret \
                                  --docker-server=$REGISTRY_URL \
                                  --docker-username=admin \
                                  --docker-password=Changeme@2025 \
                                  --namespace=2401137 \
                                  --dry-run=client -o yaml | kubectl apply -f -

                                kubectl create secret generic backend-secrets \
                                  --from-env-file=$ENV_FILE_PATH \
                                  --namespace=2401137 \
                                  --dry-run=client -o yaml | kubectl apply -f -

                                # Apply all manifests
                                kubectl apply -f . -n 2401137
                                
                                # Rollout Restart to update pods
                                kubectl rollout restart deployment/campus-connect-backend -n 2401137
                                kubectl rollout restart deployment/campus-connect-frontend -n 2401137
                            '''
                        }
                    }
                }
            }
        }
    }
}