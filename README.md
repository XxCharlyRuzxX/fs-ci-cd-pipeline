# Phonebook – CI/CD Pipeline

This repository contains the Phonebook application developed as part of the Full Stack Open course Task 21, extended with an automated CI/CD pipeline using GitHub Actions and Fly.io.

## URL Application

[Phonebook – Backend](https://phonebook-backend-small-moonbeam-5457.fly.dev/)

## CI/CD Pipeline

The deployment pipeline is implemented using GitHub Actions and includes the following stages:

1. **Build and Test**
   - Install backend and frontend dependencies.
   - Run linting checks.
   - Execute automated tests.
   - Build the frontend.

2. **Deployment**
   - Deploy the application to Fly.io.
   - Deployment only runs after the build and tests succeed.

3. **Notifications**
   - Send success or failure notifications to Discord.

4. **Versioning**
   - Automatically generate version tags after successful deployments.

## Health Check

A separate GitHub Actions workflow periodically checks the availability of the deployed application through an HTTP GET request.

It can also be triggered manually using `workflow_dispatch`.
