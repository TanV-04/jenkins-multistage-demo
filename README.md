# jenkins-multistage-demo

# jenkins-multistage-demo

A demo for a multistage Jenkins pipeline that runs Build → Test → Deploy for branches:
dev, feature-api, feature-ui.

Prereqs:
- Docker Desktop running
- git
- (optional) GitHub repository to host the code (recommended)

## Local quickstart (Docker Desktop)

1. Clone repository:
   git clone <your-repo-url> jenkins-multistage-demo
   cd jenkins-multistage-demo

2. Build and start Jenkins:
   docker compose up -d --build

3. Open Jenkins at: http://localhost:8080
   - If setup wizard disabled (we did), create admin user via Manage Jenkins → Configure Global Security if needed.
   - Install recommended plugins: Pipeline, GitHub Branch Source, Docker Pipeline (if not already).

4. Create a Multibranch Pipeline job in Jenkins:
   - New Item → Multibranch Pipeline → Configure:
     - Branch Sources → add your repository (Git URL) and credentials (if private).
     - Under Build Configuration, keep `Jenkinsfile` (Default).
     - Under "Scan Multibranch Pipeline Triggers" add "Periodically if not otherwise run" or set up GitHub webhooks to trigger builds on push.

5. Create branches & push:
   git checkout -b dev
   git push -u origin dev

   git checkout -b feature-api
   git push -u origin feature-api

   git checkout -b feature-ui
   git push -u origin feature-ui

6. Merge feature-api → dev
   - Merge locally:
     git checkout dev
     git merge feature-api
     git push origin dev
   - Jenkins Multibranch should detect the updated `dev` branch and run pipeline for `dev`. (Or use webhook in GitHub to trigger immediately.)

7. View console output in Jenkins for the branch job. You should see Build → Test → Deploy steps execute, and Docker images created locally.

## Notes
- The pipeline builds docker images locally (tagged per branch) and runs containers on ports:
  - dev -> 3000
  - feature-api -> 3001
  - feature-ui -> 3002
- If running Jenkins in Docker, we mount /var/run/docker.sock so it can build images using host Docker.
