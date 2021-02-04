# fitme

[Website Link](https://gofitme.herokuapp.com) [Demo Video](https://www.youtube.com/watch?v=icFoew4bchg)

*(Note that the ML model runs on the free memory tier on Heroku as a Docker container and it may not work with a high resolution image.)*

A platform allowing users to share and discover fashion inspiration,
eased through machine learning and a friendly social network.

## Architecture Overview

### Frontend

- Framework: React
  - State Management: Redux
- UI Library: MaterialUI
- Build System: Yarn

### Backend

- Middleware: Flask HTTP API
- MongoDB (Document-based NoSQL DB)
- Amazon AWS S3 - Blob/Image Storage

### Machine Learning

Libraries:

- Pandas
- NumPy
- PyTorch
  - Detectron2

typeset on Jupyter Notebook

### Languages

- Frontend - TypeScript
- Backend (ML Model and API) - Python

### Workflow

CI/CD Provider: GitHub Actions

- Run linter

See `frontend/package.json` for detailed frontend library dependencies.
