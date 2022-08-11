# BCIS Application
![250 Active Devices](https://img.shields.io/badge/Active%20Devices-250-green)
![134 User Accounts](https://img.shields.io/badge/User%20Accounts-134-blue)

This repo holds the code for the **application I created for my school: BCIS.**

[![Demo Video](https://i.imgur.com/W6HIG3B.png)](https://www.youtube.com/watch?v=pLdjQfUeFTU)

Licensed under AGPL, this is a *Full-Stack React Native App 📱* working in conjunction with a *Django Server💻 (Django Rest Framework)*

It is coded with the ⚡️best practices⚡️ in mind:
- ✅Conforms to **code style** of the frameworks used
- ✅Safe **Typescript Codebase**
- ✅Immutable safe state with Redux
- ✅JWT Code Authentication with **AWS Cognito**
- ✅AirBnB ESLint Configuration
- ✅Error tracking with Sentry
- ✅Organized **MVC REST API architecture** with Django Rest Framework
- And more...

# Architecture
The architecture was designed by me and utilizes **AWS as the main cloud provider.**

- Authentication: **AWS Cognito** with *custom code to verify API authorization*.
  - Email Confirmation: **AWS Lamda Functions**
- File Storage: **AWS S3** utilizing Boto3 library.
- Hosting: **AWS EC2**
- Frontend: **React Native (Typescript)**
- Backend: **Django REST Framework (Python)**
