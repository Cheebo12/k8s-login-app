#  Full-Stack Node.js Login App on Kubernetes

This repository contains an optimized, production-ready version of the "K8s in 1 Hour" demo. It features a lightweight Docker image, automated database seeding, and secure secret management.

## 🛠 Improvements & Optimizations
- **Slim Image**: Reduced size from 1.2GB to **~160MB** using `node:20-slim`.
- **Security**: Switched to `bcryptjs` for native hashing without Python dependencies.
- **Automation**: `createuser.js` runs automatically on startup to sync the App User with K8s Secrets.
- **Sync Logic**: Automatically wipes old users and creates a new one whenever the Secret changes.

---

##  K8s Manifest Files
* `mongo-secret.yaml` - Base64 encoded credentials (`mongouser` / `mongopassword`).
* `mongo-config.yaml` - MongoDB connection URL.
* `mongo.yaml` - MongoDB Deployment and ClusterIP Service.
* `webapp.yaml` - Node.js App Deployment and NodePort Service.

---

##  Getting Started

### 1. Start Minikube
```bash
minikube start
minikube status
```
### 2. Apply Manifests (Order Matters)
```bash
kubectl apply -f mongo-secret.yaml
kubectl apply -f mongo-config.yaml
kubectl apply -f mongo.yaml
kubectl apply -f webapp.yaml
```
### 3. Access the Application
```bash
# This creates a tunnel to your NodePort
minikube service webapp-service
```
### 4. Check Status & Logs
```bash
# View all running components
kubectl get all

# Get application logs (check if user was created)
kubectl logs -l app=webapp

# Get detailed info about a pod
kubectl describe pod {pod-name}
```
### 5. Update Credentials

#### If you update the username or password in mongo-secret.yaml then apply
```bash
kubectl apply -f mongo-secret.yaml
```
#### Restart Webapp 
```bash
kubectl rollout restart deployment webapp-deployment
```
#### Restart Mongo 
```bash
kubectl delete pod -l app=mongo
```
