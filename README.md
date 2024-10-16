# My Button Project

Este proyecto es un aplicación web que consta de un botón. Al pulsarlo, éste mostrará contenido aleatorio en formato texto.

## Tecnologías utilizadas

Para la realización de este proyecto se han utilizado las siguientes tecnologías:

- Frontend:
   - React
   - Bootstrap
   - CSS

- Backend
    - Express JS

- Despliegue
    - Docker
    - Nginx

 - Control de versiones:
    - GitHub

 - Tanto frontend como backend se han desarrollado con el uso del linter ESlint para mantener un correcto formato de código.
 - El proyecto se ha desarrollado completamente en Linux en integración con VSCode.

## Cómo desplegar la aplicación

Dado que la aplicación se ha desarrollado enteramente en Docker, su despliegue es sencillo siguiendo estos paso:

### 1. Clonar repositorio

Clonar repositorio en servidor o local.

### 2. Añadir ficheros .env

Es necesario añadir dos ficheros de configuración de variables de entorno. Uno para el backend y otro para el frontend. Se proporcionan los ficheros de referencia .env.ejemplo como ejemplo de las variables de entorno que es obligatorio añadir.
 - Frontend: mybuttonproject.web/.env
 - Backend: mybuttonproject.api/.env

 ### 3. Generar imagen OCI y ejecutar contenedor Docker

 Todos los comandos que se describen en este punto han de lanzarse desde la raíz del proyecto, donde se alojan los ficheros Dockerfile y Dockerfile.dev

#### Opción 1: Docker compose

Se puede generar la imagen OCI y lanzar el contenedor Docker con tan solo un comando usando docker compose. Además, se ha configurado el despliegue para que se pueda elegir entre despliegue en desarrollo y en producción.

 - Despliegue en desarrollo:
    
    Desplegar la aplicación en un contenedor de desarrollo permite hacer cambios y visualizarlos en tiempo real en el contenedor gracias al uso de volúmenes. Hay que tener en cuenta que con esta opción se generará una imagen más pesada debido al uso de las dependencias de desarrollo.

        docker-compose -f docker-compose-dev.yml up

    En el fichero docker-compose-dev.yml se encuentran las características del despliegue en desarrollo: nombre de la imagen creada, puestos de escucha, archivo Dockerfile que se usará para generar la imagen y levantar el contenedor, volúmenes, etc.

- Despliegue en producción:

    Mediante este despliegue se obtiene la imagen con la build final del proyecto y el contenedor Docker donde se estará ejecutando.

        docker-compose up

    En el fichero Dockerfile se encuentran las instrucciones para compilar la aplicación y lanzar el contenedor. En la opción de desarrollo Nginx será el servidor web encargado de mostrar el frontend. Su configuración e instalación también se realiza mediante este fichero.
    
    Tras lanzar este comando la aplicación será visible a través de http://localhost:8080 sirviendo el backend a través del puerto 3000.

#### Opción 2: Docker build y docker run

Se pueden lanzar ambos despliegues, desarrollo y producción, de forma manual, es decir, ejecutando primero el comando de creación de la imagen OCI y después el levantamiento del contenedor a partir de dicha imagen. Sólo se recomienda este método para levantar la imagen final de producción, ya que el comando para levantar el contenedor de desarrollo sería largo teniendo en cuenta que habría que indicar, además de los puertos de escucha, los volúmenes a utilizar.

- Crear imagen que contiene la build final del proyecto:

        docker build -t mybuttonproject:latest .

- Levantar el contenedor a partir de la imagen de producción:

        docker run -p 3000:3000 -p 8080:80 mybuttonproject:latest

    Tras lanzar este comando la aplicación será visible a través de http://localhost:8080 sirviendo el backend a través del puerto 3000.

#### NOTA:
    La imagen final de producción está basada en una imagen base que contiene las dependencias de producción de la aplicación. Esta imagen base se puede encontrar con el nombre vicofran/mybuttonprojectbase:latest en DockerHub.

## Descripción de la API

La API se ha desarrollado con el uso de Express JS para lanzar el servidor backend.

La API consta de sólo un endpoint funcional. A través de este endpoint, el frontend solicitará el conenido de un fichero en concreto ("chistes" o "quijote").
El contenido de ambos ficheros se encuentra en los archivos .json con el mismo nombre en la carpeta /assets.

Con intención de que la aplicación sirviera realmente contenido aleatorio no almacenado en el servidor, se ha tratado de hacer una conexión a la API de OpenAI con una consulta concreta. Si la respuesta contuviese algún error, entonces el backend resolvería la petición con uno de los archivos estáticos.

Las clave y el prompt de la petición para acceder al endpoint de OpenAI se encuentran en el fichero .env almacenados como variables de entorno.
Para tener acceso a las variables de entorno desde Espress JS han sido necesarias las dependencias **dotenv**.

También ha sido necesario el uso de la dependencia **cors** para permitir la comunicación del frontend con la API.

## Explicación de la arquitectura utilizada

Con este diseño de arquiectura se han buscado dos objetivos:
- Poder levantar la aplicación con tan **sólo una imagen OCI**
- Que esta imagen incluyera **dos proyectos claramente diferenciados** (api y web).

Se ha considerado desde el principio importante cumplir con esas dos características.
Ambas partes del proyecto comparten en la raíz los ficheros de creación de imagen OCI y levantamiento del contenedor de despliegue.

## Dificultades a la hora de realizar el proyecto

- Desconocimiento de las distintas tecnologías que se han usado en el proyecto. La gran parte del tiempo de realización del proyecto ha sido investigando y estudiando estas nuevas tecnologías. (React, NodeJS, Docker).
- Despliegue en desarrollo del proyecto. Al principio se optó por React + Vite pero no fue posible crear volúmenes para el desarrollo del frontend. Para resolverlo se optó por crear el proyecto de nuevo en Linux (se estaba desarrollando en Windows) por descartar problemas de compatibilidad. Pero el problema persistió y se optó por descartar Vite. Para compilar el frontend y lanzar el contenedor en producción Vite no presentó problemas, pero era inviable desarrollar sin ver los cambios en tiempo real desde el contenedor.
- Instalación de linter ESLint en el frontend.

## Algunas referencias usadas para aprender las tecnologías utilizadas en el proyecto.

- Docker:

    - Youtube - HOLA MUNDO - https://www.youtube.com/watch?v=4Dko5W96WHg

- React

	- Youtube - HOLAMUNDO -	https://www.youtube.com/watch?v=yIr_1CasXkM
	
	- Youtube - MIDULIVE - https://www.youtube.com/watch?v=7iobxzd_2wY&list=PLUofhDIg_38q4D0xNWp7FEHOTcZhjWJ29

- Node JS
	- Youtube - MIDULIVE - https://www.youtube.com/watch?v=yB4n_K7dZV8&list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7
