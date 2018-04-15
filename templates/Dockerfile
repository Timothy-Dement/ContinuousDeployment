FROM ubuntu:16.04

RUN apt-get -y update


# update packages and install
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get -y install nodejs

RUN apt-get -y install nginx

WORKDIR /usr/src/app

COPY ./checkbox.io .

RUN cp ./local-conf/default /etc/nginx/sites-available/default

RUN cp ./local-conf/nginx.conf /etc/nginx/nginx.conf


RUN cd server-side/site/ ; npm install



WORKDIR /usr/src/app/server-side/site

COPY ./start.sh .

EXPOSE 80
EXPOSE 443

CMD ./start.sh

RUN service nginx restart
