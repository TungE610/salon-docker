FROM --platform=linux/amd64 php:7.4-fpm-alpine
 
WORKDIR /var/www/html
 
RUN docker-php-ext-install pdo pdo_mysql