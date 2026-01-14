// ===============================
// Configuración general del documento
// ===============================

#set page(
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 3cm),
)

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
    Sistemas de Información para la Web
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
    Alumnos: \ 
    Mario Orviz Viesca \
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

Incluye:
- Contexto / motivación (personal, académico, social, empresarial…)
- Objetivo general del proyecto
- Objetivos específicos (3–6 puntos concretos)
- ¿Qué valor aporta? ¿Qué mejora respecto a soluciones existentes?
- Relación con los contenidos de la asignatura SIW

#v(1fr)

#pagebreak()
// ===============================
// 3. ¿Cómo se ha hecho?  (≈ 2–3 páginas)
// ===============================

= ¿Cómo se ha hecho? <como>

Descripción técnica detallada del desarrollo.

== 3.1. Arquitectura general

Diagrama de alto nivel (frontend, backend, base de datos, servicios externos, etc.)

== 3.2. Tecnologías y herramientas utilizadas

- Lenguajes / frameworks
- Librerías principales
- Herramientas de desarrollo (Vite, npm/pnpm, Docker, etc.)
- Servicios externos (Firebase, Supabase, Vercel, Cloudinary, Stripe…)

== 3.3. Estructura del proyecto

Breve explicación de la organización de carpetas (src/, components/, pages/, api/, etc.)

== 3.4. Decisiones técnicas importantes

Ejemplos:
- ¿Por qué elegiste X en lugar de Y? (React vs Vue, REST vs GraphQL, SQL vs NoSQL…)
- Autenticación / autorización
- Gestión del estado
- Manejo de formularios
- SEO / rendimiento / accesibilidad
- Despliegue y CI/CD

== 3.5. Dificultades técnicas encontradas y cómo se resolvieron

(Principalmente las más relevantes para la asignatura)

#v(0.8fr)

#pagebreak()
// ===============================
// 4. ¿Cómo se usa?  (≈ 1 página)
// ===============================

= ¿Cómo se usa? <uso>

Guía rápida de uso para un usuario nuevo.

Incluye:
- Cómo acceder (URL)
- Pasos básicos para las funcionalidades principales
- Capturas de pantalla representativas (puedes insertarlas con //#image("captura-01.png", width: 80%))
- Requisitos mínimos (navegador, conexión…)

#v(1fr)
#pagebreak()
// ===============================
// 5. ¿Qué hemos aprendido?  (≈ 1–2 páginas)
// ===============================

= ¿Qué hemos aprendido? <aprendizaje>

Reflexión personal y técnica tras haber realizado el proyecto.

Posibles apartados:

== 5.1. Aprendizajes técnicos

- Nuevas tecnologías / patrones aprendidos
- Conceptos de SIW que se han entendido mejor al aplicarlos
- Buenas prácticas descubiertas (o errores que no volverías a cometer)

== 5.2. Aprendizajes transversales

- Gestión del tiempo
- Trabajo en equipo (si aplica)
- Comunicación con cliente/usuario imaginario
- Debugging en producción

== 5.3. Valoración global

¿Ha merecido la pena? ¿Lo volverías a hacer de forma diferente? ¿Qué te llevas para tu futuro profesional?

#v(1fr)
#pagebreak()
// ===============================
// Referencias / Bibliografía
// ===============================

= Referencias <referencias>

- Documentación oficial de las tecnologías utilizadas
- Tutoriales / artículos que fueron clave
- Repositorios de inspiración (si los hubo)
- Libros / capítulos relevantes de la asignatura (si procede)

Ejemplo de formato:

#list(
  [*Next.js* — #link("https://nextjs.org/docs")],
  [*Tailwind CSS* — #link("https://tailwindcss.com/docs")],
  [Capítulo 5 — Arquitecturas Web Modernas — Apuntes SIW],
)
