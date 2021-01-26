# fitme Backend

HTTP API made using Flask (Python) and containerized using Docker. The ML model behind the image segmentation is accessed through a pickled file, but the Jupyter Notebook and inference script are in `../ml`.

### Instructions

To run the backend web server, you will need Docker installed on your system. This is to ensure that the development environment is uniform and consistent across all systems. First, build a Docker container using `docker build -t flask-heroku:latest .`. Next, spin it up on port 5000 using `docker run -d -p 5000:5000 flask-heroku`. You should
be able to send HTTP requests using the API now (for instance, `localhost:5000/profile_data?username=peterwu`).

### Deployment

You will need Heroku CLI installed.

First, authenticate via `heroku login`.

Next, `heroku container:login`.
