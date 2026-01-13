# Visual Oscilator
## What is this
Esto es un proyecto sencillo que simula un acordeón virtual junto con un theremin: gracias a un feed de una cámara, el usuario puede controlar un instrumento sencillo y visual.
## Despliegue
### Paso previo común a todos los métodos
Primero, hacer un fork del proyecto si lo deseas, y luego hacer el clonado.
```
git clone https://github.com/orvizz/visual-oscilator.git
cd visual-oscilator
```
### GitHub Pages
Si se hace un fork del proyecto, se puede realizar el despliegue en github pages.
En GitHub:
Repositorio → Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: /root
### De forma local: Live Server (VS Code)
Esta es la forma más sencilla.
Abre la carpeta del proyecto en VS Code, e instala la extensión Live Server
Como existe un index.html, basta con pulsar abajo a la derecha, el botón de "go live".
### De forma local: Node.js
Se debe tener Node.js instalado.
Mismamente con VS Code, o desde una terminal fuera de este, escribe en la raíz del proyecto el comando:
```
npx serve .
```
### Otros
Al ser un par de páginas html estáticas con código javascript, este proyecto se puede integrar a cualquier servidor html estático que permita servir dichos archivos.
