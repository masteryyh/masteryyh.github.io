FROM nginx:1.29.4-alpine3.23

LABEL author="masteryyh"
LABEL email="yyh991013@163.com"
LABEL description="Docker image for masteryyh's portfolio website"

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
