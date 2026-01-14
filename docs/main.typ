// ===============================
// Configuración general del documento
// ===============================

#set page(
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 3cm),
  footer: context {
    let i = counter(page).at(here()).at(0)
    if i > 1 {
      set align(center)
      counter(page).display()
    }
  },
)

// Definición del estilo de recuadro (puedes poner esto al inicio de tu archivo)
#let nota(titulo, cuerpo) = rect(
  fill: rgb("#f8f9fa"), 
  stroke: (left: 4pt + blue.darken(20%)), 
  inset: 15pt,
  width: 100%
)[
  *#titulo* \ #cuerpo
]

#set text(
  size: 12pt,
  lang: "es",
)

#set par(
  justify: true,
  leading: 0.55em,
)

#set heading(
  numbering: "1.",
)

#set quote(block: true)

#show heading.where(level: 1): set text(size: 14pt, weight: "bold")
#show heading.where(level: 2): set text(size: 13pt, weight: "semibold")

// ===============================
// Portada
// ===============================

#align(center)[
  #v(1.5cm)

  #text(size: 18pt, weight: "bold")[
    Documentación del proyecto
  ]

  #v(0.8cm)

  #text(size: 15pt)[
    Informática Audiovisual
  ]

  #v(1.2cm)

  #text(weight: "bold", size: 14pt)[
    Oscilador visual
  ]

  #v(0.6cm)

  #text(size: 12pt)[
    Sistemas de Información para la Web \
    Grado de ingeniería informática del software \
    Universidad: Universidad de oviedo
  ]

  #v(1.5cm)

  #text(weight: "semibold")[
    Mario Orviz Viesca - UO295180 \ 
    Sergio Riesco Collar \
    Javier Carrasco Arango
  ]

  #v(2cm)
]

#pagebreak()

// ===============================
// Índice
// ===============================

#outline(
  title: [Índice],
  indent: auto,
  depth: 3,
)

#pagebreak()
#counter(page).update(1)

// ===============================
// 1. ¿Qué se ha hecho?  (≈ 1 página)
// ===============================

= ¿Qué se ha hecho? <que>

Este proyecto se trata de un instrumento virtual interactivo, similar en concepto a un theremin y un acordeón.

Se trata de una página web estática, hecha puramente con html, css y javascript, por lo que su despliegue, que se detallará más adelante, es trivial. Por el mismo motivo, el proyecto ocupa muy poco espacio y es ligero.

El proyecto está pensado como exposición interactiva, por lo que está diseñado para su uso de continuo, sin pausas. En una exposición, los usuarios se acercarían a la pantalla o proyección y mirarían a la cámara, donde verían un rectángulo con un título explicativo, y a ellos mismos en la pantalla.

Debido a su uso intuitivo, se ha optado por no indicar las instrucciones de uso directamente en la interfaz a favor de una apariencia más limpia y minimalista. Al elevar las manos hacia la pantalla, verán que aparecen con una forma, y una vez que se pueden ver dos manos, una onda las conecta y genera un sonido que depende de la posición de esas manos. La gracia es que esas dos manos no tienen porqué pertenecer a una misma persona, y la cámara está dispuesta adrede para obligar a realizar movimientos exagerados para mayores cambios, a fin de que se trate de una experiencia más bien entretenida y poco exigente. 

Los detalles completos de cada mecánica del instrumento están explicados en detalle en la sección @uso más adelante.

#v(1fr)

#pagebreak()
// ===============================
// 2. ¿Por qué? ¿Para qué?  (≈ 1 página)
// ===============================

= ¿Por qué? ¿Para qué? <porque>

Dado que se nos pidió un software que modelase una instalación artística, con especial énfasis en la interacción del usuario con dicha aplicación, se nos ocurrió la idea del instrumento antes siquiera de conocer que más grupos en el pasado habían tenído ideas similares.

Nuestra idea inicial era, dado el espacio abierto típico de una exposición y la naturaleza del ir y venir de los asistentes, un instrumento sencillo interactivo sería un punto de interés para los asistentes de todas las edades. La idea sería que fueran atraidos a la exposición por el sonido o movimientos que realizaran otros usuarios, y probaran ellos mismos.

El objetivo del proyecto es ofrecer una experiencia de exploración y experimentación de las reglas del instrumento, que prueben a interactuar con la cámara y descubran cómo influencia al sonido, y que con eso, intenten hacer algo de música.

TODO
#v(1fr)

#pagebreak()
// ===============================
// 3. ¿Cómo se ha hecho?  (≈ 2–3 páginas)
// ===============================

= ¿Cómo se ha hecho? <como>

El proyecto se ha desarrollado primero haciendo un diseño conceptual y definiendo las reglas por las que el instrumento se regiría, y luego separando la lógica en diferentes módulos o secciones para su desarrollo.

Se avanzó en el proyecto tanto en el tiempo disponible en el aula como de forma autónoma en casa, por lo que se utilizó un repositorio en GitHub así como técnicas de branching.

== Arquitectura general

La arquitectura del proyecto ha sufrido cambios conforme ha avanzado el desarrollo, y acabó siendo centralizado el flujo de los datos y lógica de negocio en un nodo de control, el orquestador. En la @fig-A0 se presenta el diagrama de bloques que describe la organización de alto nivel del sistema.

#figure(
  image("diagrams/out/A0diagram/A0.svg", width: 85%),
  caption: [Vista general de la arquitectura (Nivel A0).],
) <fig-A0>

El diagrama de nivel A1 (ver @fig-A1) detalla la implementación técnica del sistema dentro del entorno de ejecución, especificando las librerías externas y la comunicación entre objetos, así como el papel del orquestador como coordinador y poseedor de la lógica de negocio.

#figure(
  image("diagrams/out/A1diagram/A1.svg"),
  caption: [Arquitectura de componentes del sistema (Nivel A1).],
) <fig-A1>

== Tecnologías y herramientas utilizadas

El proyecto hace uso de las siguientes tecnologías:
- Html, javascript y css
- p5.js y p5 sound library
- Mediapipe hands library

== División del proyecto

El diseño y desarrollo se realizó a partes iguales por los tres integrantes del equipo:
- El diseño fue puesto en común, aportado y llevado a consenso por todos los integrantes.
- El aspecto visual del sistema fue realizado principalmente por Sergio.
- El módulo de sonido fue realizado principalmente por Javier, con ayuda de Mario y Sergio.
- El módulo visual y de reconocimiento de las manos fue realizado principalmente por Mario, con ayuda de Javier y de Sergio. 

== Estructura del proyecto

El proyecto se organiza en una estructura de directorios que separa la documentación técnica y los activos de diseño del código fuente lógico y funcional. A continuación se detallan los componentes principales:

=== Documentación y Diagramas (`/docs`)
Esta carpeta centraliza el material gráfico y el documento principal de la memoria:
- *`/diagramas/out`*: Contiene las versiones finales exportadas en formato SVG de los diagramas A0 y A1 para su inclusión en el PDF.
- *`/diagramas/src`*: Almacena el código fuente original en PlantUML (`.puml`), permitiendo la edición y mantenimiento de la arquitectura.
- *`main.typ`*: Archivo fuente de Typst utilizado para generar la memoria técnica.
- *`main.pdf`*: Documento final compilado.

=== Código Fuente de la Aplicación
La lógica del sistema está distribuida de forma modular para facilitar el mantenimiento:

- *Raíz del Proyecto*:
  - `index.html`: Punto de entrada de la aplicación web, e importación de librerías.
  - `hand-wave-visualizer.css`: Define los estilos visuales y el layout de la interfaz visual de la aplicación.
  - `main.js`: Punto de entrada de la aplicación; utiliza la función `setup()` de p5.js para inicializar el orquestador.
  - `orchestrator.js`: Actúa como mediador entre los módulos de visión y sonido, gestionando el flujo de datos y la lógica de negocio.
  - `README.md`: Documentación básica para la instalación y ejecución del software.
- *`/music`*: 
  - `musicModule.js`: Contiene la lógica de síntesis de audio (osciladores, envolventes y generación de ondas).
  - `musicModule.html`: Interfaz visual sencilla para la prueba del módulo de audio.
- *`/visuals`*:
  - `handVisualizer.js`: Implementa la clase encargada del reconocimiento de manos mediante MediaPipe y la renderización de efectos visuales con p5.js.

== Decisiones técnicas importantes


Para realizar este proyecto, se decidió utilizar p5.js como framework principal para la gestión del canvas y la interacción con la cámara, debido a su facilidad de uso y su integración con la librería p5.sound, que facilitó enormemente la generación de audio en tiempo real.

Antes de decidirse por p5.js, se consideraron otras opciones como Processing, pero finalmente nos decantamos por p5.js debido a su fácil integreación con tecnologías de visión por computador como MediaPipe, que fue crucial para el reconocimiento de las manos.

Además, no se utilizó ningún framework de frontend como React o Vue, ya que el proyecto no requería una interfaz de usuario compleja ni una gestión avanzada del estado. En su lugar, se optó por una estructura más sencilla y directa utilizando HTML, CSS y JavaScript.

Otro punto a favor de las tecnologías elegidas fue la facilidad de despliegue, ya que al tratarse de una aplicación web estática, se puede alojar en cualquier servidor web sin necesidad de configuraciones adicionales.

Para realizar el despliegue, se optó por GitHub Pages debido a su simplicidad y gratuidad para proyectos estáticos, lo que permitió una rápida puesta en marcha y acceso público al proyecto.

De todas formas, se consideraron otras opciones de despliegue como Azure, pero finalmente se decidió por GitHub Pages por su integración directa con el repositorio del proyecto y su simplicidad.

== Dificultades técnicas encontradas y cómo se resolvieron

En las siguientes secciones se describen algunas de las dificultades técnicas más relevantes encontradas durante el desarrollo del proyecto y las soluciones implementadas para superarlas.

=== Dificultad 1: Latencia en el reconocimiento de manos

Una dificultad técnica importante fue la latencia en la captura de vídeo y el procesamiento de las manos, que afectaba a la experiencia del usuario. Para mitigar este problema, se optimizó el código de reconocimiento, descartando valores no necesarios aportados por MediaPipe y tratando de reducir la carga computacional en cada frame.

=== Dificultad 2: Espacio dimensional y mapeo de coordenadas

Al principio, resultó complicado trabajar con coordenadas 3D. Era la idea original, ya que MediaPipe proporciona coordenadas en 3D, pero al final se optó por trabajar únicamente con las coordenadas 2D (X e Y) para simplificar el mapeo de las posiciones de las manos a parámetros de sonido y visuales. Esto facilitó la implementación y mejoró tanto la experiencia del usuario como el rendimiento.

=== Dificultad 3: Generación de sonido en tiempo real

La generación de sonido en tiempo real presentó varios desafíos, especialmente en la creación de ondas suaves y agradables al oído. Se experimentó con diferentes tipos de osciladores y envolventes para encontrar una configuración que produjera un sonido satisfactorio. Finalmente, se optó por utilizar ondas senoidales con envolventes ADSR para lograr un sonido más musical. Dado que ningún miembro del equipo tenía experiencia previa en síntesis de audio, se dedicó tiempo a investigar y aprender los conceptos básicos necesarios para implementar esta funcionalidad.

#v(0.8fr)

#pagebreak()
// ===============================
// 4. ¿Cómo se usa?  (≈ 1 página)
// ===============================

= ¿Cómo se usa? <uso>

TODO
Guía rápida de uso para un usuario nuevo.

Incluye:
- Cómo acceder (URL)
- Pasos básicos para las funcionalidades principales
- Capturas de pantalla representativas (puedes insertarlas con //#image("captura-01.png", width: 80%))
- Requisitos mínimos (navegador, conexión…)

== Acceso o despliegue <acceso>

La forma más sencilla de acceder al proyecto es a través de la siguiente URL: \
#link("https://orvizz.github.io/visual-oscilator/") \
Donde el proyecto está desplegado utilizando GitHub Pages.

En caso de querer ejecutar el proyecto localmente, es necesario clonar el repositorio desde GitHub y servir los archivos utilizando un servidor web local. Esto se puede hacer utilizando herramientas como `Live Server` en Visual Studio Code o cualquier otro servidor web estático.

Al tratarse de una aplicación web que trabaja con visión por computador, es necesario utilizar un navegador moderno que soporte las APIs de cámara y WebGL. Se recomienda utilizar Google Chrome o Mozilla Firefox para una mejor compatibilidad y rendimiento. También es importante asegurarse de que el navegador tenga permisos para acceder a la cámara del dispositivo.

== Canvas

Para entender mejor cómo interactuar con el instrumento, es importante conocer como funciona el canvas. Se trata de un rectángulo centrado en la pantalla que muestra la imagen capturada por la cámara, con un efecto de espejo horizontal para facilitar la interacción. Dentro de este rectángulo, se renderiza la imagen obtenida por la cámara.

El canvas funciona como un plano bidimensional, donde solo se tienen en cuenta las coordenadas X e Y de las manos. La coordenada X representa la posición horizontal (izquierda a derecha) y la coordenada Y representa la posición vertical (arriba a abajo). La profundidad (coordenada Z) no se utiliza en este proyecto debido a que solo aportaba dificultad y problemas de rendimiento y no era necesaria para la funcionalidad del instrumento.

== Controles y mecánicas del instrumento

El instrumento se contrloa mediante la distancia y posición de las manos detectadas por la cámara.

Para activar el instrumento, es necesario que la cámara detecte dos manos. Una vez que se detectan dos manos, se genera una onda visual que conecta ambas manos y produce un sonido. 

Las diferentes posibilidades de configuracion del sonido mediante la posición de las manos son las siguientes:
- #link(<freq>)[Frecuencia de la onda sonora]
- #link(<amp>)[Amplitud del sonido]
- #link(<pan>)[Panner o panoramización del sonido]

=== Frecuencia de la onda sonora  <freq>

La frecuencia del sonido se controla mediante la distancia eucídea de las dos manos, y es inversamente proporcional a dicha distancia. Es decir, cuanto más cerca estén las manos, mayor será la frecuencia del sonido (tono más agudo), y cuanto más separadas estén, menor será la frecuencia (tono más grave).

Esta relación inversa permite a los usuarios controlar el tono del sonido de manera intuitiva, acercando o alejando las manos para producir diferentes notas musicales.

La distancia entre las manos se calcula utilizando la fórmula de distancia euclidiana en dos dimensiones:


$ d(x, y) = sqrt((x_1 - x_2)^2 + (y_1 - y_2)^2) $

Donde (x1, y1) y (x2, y2) son las coordenadas de las dos manos en el canvas.

Una vez calculada la distancia, se mapea a un rango de frecuencias audibles utilizando una función de mapeo logarítmica para una mejor percepción auditiva. La fórmula utilizada para el mapeo es la siguiente:

$ f(v) = o_min dot (frac(o_max, o_min))^(frac(v - i_min, i_max - i_min)) $

Donde:
- `f(v)` es la frecuencia resultante.
- `o_min` y `o_max` son los valores mínimo y máximo del rango de salida (frecuencia).
- `i_min` y `i_max` son los valores mínimo y máximo del rango de entrada (distancia entre manos).
- `v` es la distancia entre las manos calculada previamente.

=== Amplitud del sonido <amp>

De una forma similar, la amplitud del sonido se controla mediante la posición vertical (coordenada Y) de las dos manos. Cuanto más alta estén las manos en el canvas, mayor será la amplitud del sonido (volumen más alto), y cuanto más bajas estén, menor será la amplitud (volumen más bajo).

Esta relación directa permite a los usuarios controlar el volumen del sonido de manera intuitiva, elevando o bajando las manos para producir diferentes niveles de volumen.

=== Panner o panoramización del sonido <pan>

El panner o panoramización del sonido se controla mediante la diferencia de distancia vertical entre las dos manos. Si la mano izquierda está más alta que la derecha, el sonido se panoramiza hacia la izquierda, y viceversa. Si ambas manos están a la misma altura, el sonido se centra.

El concepto de panoramización permite a los usuarios controlar la ubicación espacial del sonido en el campo estéreo, creando una experiencia auditiva más inmersiva.

#rect(
  fill: rgb("#e1f5fe"), // Un azul claro de fondo
  stroke: (left: 4pt + blue), // Una línea gruesa a la izquierda
  inset: 12pt, // Espaciado interno
  radius: 2pt
)[
  *Atención:* La panoramización del sonido se aprecia mejor con el uso de auriculares.
]

Para llevar a cabo el objeto de panoramización, se utiliza Panner3D de la librería p5.sound, que permite posicionar el sonido en un espacio tridimensional. En este caso, solo se utilizan el eje X y el eje Z o profundidad. Este efecto simula u seminírculo alrededor del oyente, donde el eje X representa la izquierda y derecha, y el eje Z representa la profundidad (cerca o lejos).

Así pues, la posición del panner se calcula de la siguiente manera:


#nota("Cálculo de Panoramización y Espacialización")[
  Para determinar la posición del sonido en el espacio 3D basándonos en los niveles de volumen de cada canal, seguimos este proceso:

  1. *Normalización de volúmenes y factor de Pan:*
  $
    L &= max(0, V_L) \
    R &= max(0, V_R) \
    S &= cases(L + R & "si" L + R != 0, 1 & "en otro caso") \
    p &= (R - L) / S 
  $

  2. *Traducción a coordenadas espaciales (Semicírculo):*
  $
    theta &= p dot pi / 2 \
    x &= sin(theta) dot r \
    z &= -cos(theta) dot r
  $
  Donde $r = 3$ representa el radio de distancia al oyente,  $(x, 0, z)$ son las coordenadas espaciales del panner y $V_L$ y $V_R$ son los volúmenes de los canales izquierdo y derecho respectivamente.
]

#v(1fr)
#pagebreak()
// ===============================
// 5. ¿Qué hemos aprendido?  (≈ 1–2 páginas)
// ===============================

= ¿Qué hemos aprendido? <aprendizaje>
TODO
Reflexión personal y técnica tras haber realizado el proyecto.

Posibles apartados:

== Aprendizajes técnicos
TODO
- Nuevas tecnologías / patrones aprendidos
- Conceptos de SIW que se han entendido mejor al aplicarlos
- Buenas prácticas descubiertas (o errores que no volverías a cometer)

== Aprendizajes transversales

TODO
- Gestión del tiempo
- Trabajo en equipo (si aplica)
- Comunicación con cliente/usuario imaginario
- Debugging en producción

== Valoración global

TODO
¿Ha merecido la pena? ¿Lo volverías a hacer de forma diferente? ¿Qué te llevas para tu futuro profesional?

#v(1fr)
#pagebreak()
// ===============================
// Referencias / Bibliografía
// ===============================

= Referencias <referencias>

#list(
  [*Mediapipe hands* — #link("https://chuoling.github.io/mediapipe/solutions/hands.html")],
  [*P5.js* — #link("https://p5js.org/reference/")],
  [*P5.sound* — #link("https://p5js.org/reference/p5.sound/")],
)
