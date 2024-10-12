# 1. CREAR BUILD DEL FRONTEND COMPILADO
FROM vicofran/mybuttonprojectbase:latest AS frontend_build

# establezco el directorio raíz del contenedor a /app
WORKDIR /app

# copio el package.json del frontend al contenedor
COPY mybuttonproject.web/package*.json ./mybuttonproject.web

# instalo las dependencias (necesito la dependencia react-scripts que es de desarrollo para ejecutar la build)
# estas dependencias no aparecerán en la build final porque partiré nuevamente de la imagen base y solo tomaré de esta frontend_build
# los ficheros que me interesen, que serán el código fuente de frontend y backend y los compilados del front para guardarlos en el servidor nginx
RUN  cd mybuttonproject.web && npm install

# copio el resto del proyecto
COPY . ./

# ejecuto el comando de compilación del frontend. Esto creara los compilados en /build que copiaré en los archivos que sirve el servidor nginx
RUN cd mybuttonproject.web && npm run build

# 2. CREAR SERVIDO NGINX PARA EL FRONTEND
FROM vicofran/mybuttonprojectbase:latest AS frontend_server_build

#  añado el servidor nginx a la imagen
RUN apk add --no-cache nginx

# borro su configuración por defecto y añado la mía al docker
RUN rm /etc/nginx/http.d/default.conf
COPY nginx/nginx.conf /etc/nginx/http.d/nginx.conf

# copio la compilación del frontend de la capa de construcción a la carpeta de servidor nginx en el contenedor
COPY --from=frontend_build /app/mybuttonproject.web/build /usr/share/nginx/html

# copio el resto de código fuente de mi aplicación
COPY mybuttonproject.api ./mybuttonproject.api
COPY mybuttonproject.web ./mybuttonproject.web

# instalo concurrently para poder ejecutar dos comandos a la vez desde el CMD (uno para levantar nginx y otro para el servidor backend)
RUN npm install -g concurrently

# expongo los puertos (por defecto nginx utiliza el 80, en el docker-compose lo mapeo con el 8080 del host)
EXPOSE 3000
EXPOSE 80

# lanzamiento de comandos para levantar los servidores
CMD ["concurrently", "--kill-others", "nginx -g 'daemon off;'", "npm run start_server --prefix ../../app/mybuttonproject.api"]


# ---------------------------------------------





# # 1. CREAR BUILD DEL FRONTEND COMPILADO
# FROM vicofran/mybuttonprojectbase:latest AS frontend_build

# WORKDIR /app

# COPY mybuttonproject.web/package*.json ./mybuttonproject.web

# RUN  cd mybuttonproject.web && npm install

# COPY . ./

# RUN cd mybuttonproject.web && npm run build

# # 2. CREAR SERVIDO NGINX PARA EL FRONTEND
# FROM vicofran/mybuttonprojectbase:latest AS frontend_server_build

# RUN apk add --no-cache nginx

# COPY --from=frontend_build /app/mybuttonproject.web/build /usr/share/nginx/html
# COPY mybuttonproject.api ./mybuttonproject.api
# COPY mybuttonproject.web ./mybuttonproject.web

# RUN npm install -g concurrently

# EXPOSE 3000
# EXPOSE 80

# CMD ["concurrently", "--kill-others", "nginx -g 'daemon off;'", "npm run start_server --prefix ../../app/mybuttonproject.api"]








# ---------------------------------------------
# FROM vicofran/mybuttonprojectbase:latest as BUILD_IMAGE
# WORKDIR /app/mybuttonproject.web

# COPY mybuttonproject.web/package*.json .

# RUN npm install

# COPY mybuttonproject.web .

# RUN npm run build

# FROM vicofran/mybuttonprojectbase:latest as PRODUCTION_IMAGE
# WORKDIR /app

# COPY --from=BUILD_IMAGE /app/mybuttonproject.web/dist/ /app/mybuttonproject.web/dist/

# COPY mybuttonproject.web/package.json ./mybuttonproject.web/
# COPY mybuttonproject.web/vite.config.js ./mybuttonproject.web/
# COPY mybuttonproject.api/package*.json ./mybuttonproject.api/

# RUN cd mybuttonproject.api && npm install
# RUN cd mybuttonproject.web && npm install

# COPY mybuttonproject.api ./mybuttonproject.api

# RUN npm install -g concurrently

# EXPOSE 3000
# EXPOSE 8080

# CMD ["concurrently", "--kill-others", "npm run preview --prefix ../../app/mybuttonproject.web", "npm run start_server --prefix ../../app/mybuttonproject.api"]