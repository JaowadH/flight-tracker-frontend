# [✈️ Flight Tracker](https://djyim49uad8qf.cloudfront.net/) – Frontend (Deployment Fork)

This repository is the **deployment-ready fork** of the frontend for our group project.

* **Original frontend source (by Cody Collins):** [CodyC1998/flight-tracker-frontend](https://github.com/CodyC1998/flight-tracker-frontend)
* **Original backend source (by Colin Yetman):** [007snoop/sdat-s4-sprint-backend](https://github.com/007snoop/sdat-s4-sprint-backend)
* **Backend deployment fork (by Jaowad Hossain):** [JaowadH/sdat-s4-sprint-backend](https://github.com/JaowadH/sdat-s4-sprint-backend)

This fork focuses on **Dockerization, AWS deployment, and CI/CD integration** for the frontend.

---

## 👥 Group Members & Contributions

### **Cody Collins**

* Developed the **React-based frontend**.
* Built UI components and pages for airports, aircraft, passengers, and cities.
* Connected frontend to backend APIs with Axios/fetch.
* Implemented forms, error handling, and overall user experience design.

---

### **Colin Yetman**

* Created the **Java Spring Boot backend**.
* Designed REST API endpoints with CRUD support for:

  * Cities (`/cities`)
  * Airports (`/airports`)
  * Passengers (`/passengers`)
  * Aircraft (`/aircraft`)
* Implemented MySQL persistence using JPA/Hibernate.
* Added validation, exception handling, and Swagger/OpenAPI documentation.

---

### **Jaowad Hossain**

* Led **Dockerization & AWS deployment** for both frontend and backend.
* Forked Cody’s frontend repo and Colin’s backend repo for **deployment pipelines**.
* Configured **GitHub Actions CI/CD** to:

  * Build React frontend and Spring Boot backend.
  * Package both into Docker images.
  * Push images to **AWS ECR**.
  * Deploy containers on **AWS EC2**.
* Integrated **AWS RDS (MySQL)** for backend persistence.
* Maintained deployment documentation and troubleshooting.

---

## 🚀 Tech Stack

* **Frontend**: React, CSS 
* **Backend**: Java 17, Spring Boot, MySQL
* **Deployment**: Docker, AWS EC2, AWS ECR, AWS RDS, IAM, GitHub Actions

---

## 🔗 Related Repositories

* **Frontend (original)** → [CodyC1998/flight-tracker-frontend](https://github.com/CodyC1998/flight-tracker-frontend)
* **Frontend (deployment fork)** → [JaowadH/flight-tracker-frontend](https://github.com/JaowadH/flight-tracker-frontend)
* **Backend (original)** → [007snoop/sdat-s4-sprint-backend](https://github.com/007snoop/sdat-s4-sprint-backend)
* **Backend (deployment fork)** → [JaowadH/sdat-s4-sprint-backend](https://github.com/JaowadH/sdat-s4-sprint-backend)

---

## 📖 How to Run Locally

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Docker

```bash
docker-compose up --build
```

---

## 📌 Deployment Notes

* Backend deployed on **AWS EC2** via Docker.
* Images hosted in **AWS ECR**.
* Database provided by **AWS RDS (MySQL)**.
* Frontend deployed via this repo with CI/CD pipelines.

---

## 🙌 Acknowledgments

This project demonstrates a **full-stack workflow** (React + Spring Boot + AWS + Docker + CI/CD) with contributions from all team members.

---

