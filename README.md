# MediaQ
CS252 stuff



-users connects to website

-login prompt

-choose [host | connect]

--host -> temp code generated

--connect -> input temp code



DOCKER STUFF

Install Docker or Docker Toolbox

Once that's finished, open cmd and cd into the project directory.

Run docker-compose up --build.

Goto the web browser and access localhost:5000.

If you want to rebuild the build folder for react run:

docker-compose restart frontend

If you want to restart server due to changes in app.py or requirements.txt run:

docker-compose restart backend
