# note-english


## How to Build
```
$ docker build -t my-apache2 .
$ docker run -dit --name my-running-app -p 8080:80 my-apache2
```

## Apply Modification to Docker
```
$ docker container cp ./ my-running-app:/usr/local/apache2/htdocs/
```
