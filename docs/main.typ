// ===============================
// Configuración general del documento
// ===============================

#set page(
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 3cm),
)

#set text(
  size: 12pt,
)

#set par(
  justify: true,
)

#set heading(
  numbering: "1.",
)

// ===============================
// Portada
// ===============================

#align(center)[
  #text(size: 16pt, weight: "bold")[
    Reseña crítica de libro
  ]

  \
  #text(size: 14pt)[
    Sistemas de Información para la Web
  ]

  \ \
  #text(weight: "bold")[Título del libro]

  \
  Autor del libro
  
  \
  Asignatura: Sistemas de Información para la Web \
  Grado / Máster: [Nombre del grado]  \
  Universidad: [Nombre de la universidad]

  \ 
  Estudiante: [Tu nombre] \ 
  Fecha: [Fecha de entrega]
]

#pagebreak()

// ===============================
// Índice
// ===============================

#outline(
  title: [Summary of Chapters],
  indent: auto,
  depth: 2,
)

#pagebreak()

// ===============================
// 1. Presentación del libro
// ===============================

= Presentación del libro

Aquí se presenta el libro reseñado, incluyendo título, autor, año de publicación y temática principal.
Debe justificarse su relevancia para la asignatura desde tu propia perspectiva como estudiante.

== Ejemplo

// ===============================
// 2. Síntesis de las ideas principales
// ===============================

= Síntesis de las ideas principales

Exposición clara de los argumentos principales del autor y de los fenómenos de la Web que analiza.

// ===============================
// 3. Análisis crítico vinculado a SIW
// ===============================

= Análisis crítico vinculado a Sistemas de Información para la Web

Relación explícita entre el contenido del libro y los aspectos teóricos y prácticos trabajados en la asignatura.

// ===============================
// 4. Aplicación actual
// ===============================

= Aplicación actual

Contextualización de las ideas del libro en el panorama tecnológico actual.

// ===============================
// 5. Reflexión personal
// ===============================

= Reflexión personal

Valoración personal de la lectura desde una perspectiva técnica, ética y formativa.

// ===============================
// 6. Conclusión
// ===============================

= Conclusión

Valoración global del libro y cierre sobre su relevancia para el aprendizaje.

// ===============================
// Referencias
// ===============================

= Referencias
