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
    Memoria del Proyecto
  ]

  #v(0.8cm)

  #text(size: 15pt)[
    Sistemas de Información para la Web
  ]

  #v(1.2cm)

  #text(weight: "bold", size: 14pt)[
    Título del proyecto
  ]

  #v(0.6cm)

  #text(size: 12pt)[
    Asignatura: Sistemas de Información para la Web \
    Grado / Máster: [Nombre del grado] \
    Universidad: [Nombre de la universidad]
  ]

  #v(1.5cm)

  #text(weight: "semibold")[
    Alumno/a: [Tu nombre] \
    Curso: [Curso académico] \
    Fecha: [Fecha de entrega]
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

= ¿Qué se ha hecho?

Breve descripción general del proyecto entregado: qué tipo de aplicación/web se ha desarrollado, cuál es su propósito principal en una sola frase y qué funcionalidades clave ofrece al usuario final.

Ejemplos de aspectos a incluir:
- Tipo de proyecto (web app, API + frontend, sitio estático con CMS, Progressive Web App, etc.)
- Tecnologías principales utilizadas (stack tecnológico resumido)
- Público objetivo / usuarios finales previstos
- Enlace al proyecto online (si está desplegado): #link("https://tu-proyecto.vercel.app")[https://tu-proyecto.vercel.app]

#v(1fr)

// ===============================
// 2. ¿Por qué? ¿Para qué?  (≈ 1 página)
// ===============================

= ¿Por qué? ¿Para qué?

Explicación del problema u oportunidad que se ha querido resolver o cubrir con este proyecto.

Incluye:
- Contexto / motivación (personal, académico, social, empresarial…)
- Objetivo general del proyecto
- Objetivos específicos (3–6 puntos concretos)
- ¿Qué valor aporta? ¿Qué mejora respecto a soluciones existentes?
- Relación con los contenidos de la asignatura SIW

#v(1fr)

// ===============================
// 3. ¿Cómo se ha hecho?  (≈ 2–3 páginas)
// ===============================

= ¿Cómo se ha hecho?

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

// ===============================
// 4. ¿Cómo se usa?  (≈ 1 página)
// ===============================

= ¿Cómo se usa?

Guía rápida de uso para un usuario nuevo.

Incluye:
- Cómo acceder (URL)
- Pasos básicos para las funcionalidades principales
- Capturas de pantalla representativas (puedes insertarlas con //#image("captura-01.png", width: 80%))
- Requisitos mínimos (navegador, conexión…)

#v(1fr)

// ===============================
// 5. ¿Qué hemos aprendido?  (≈ 1–2 páginas)
// ===============================

= ¿Qué hemos aprendido?

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

// ===============================
// Referencias / Bibliografía
// ===============================

= Referencias

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

#pagebreak()

Gracias por la atención.