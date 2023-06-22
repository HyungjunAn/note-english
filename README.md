# note-english


## How to Build
```
$ docker build -t my-apache2 .
$ docker run -dit --name my-running-app -p 8080:80 -v ${pwd}:/usr/local/apache2/htdocs my-apache2

// if container is stopped
$ docker start my-running-app
```