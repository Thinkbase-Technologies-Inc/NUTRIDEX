# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Personas interesadas en su nutrición y bienestar que necesitan consultar equivalencias de alimentos de forma rápida, privada y sin barreras.
- Pacientes guiados por un plan alimenticio basado en el Sistema de Alimentos Equivalentes (SMAE) que necesitan sustituir alimentos en su día a día (e.g., en la cocina o en el restaurante).
- Profesionales o estudiantes de nutrición que requieren una herramienta ágil y precisa para calcular porciones escalables.

## Product Purpose

NutriDex convierte la tabla técnica de alimentos equivalentes en una herramienta digital ágil, intuitiva y atractiva. Permite buscar alimentos al instante, calcular porciones exactas con cantidades enteras o fraccionarias, comparar sustitutos dentro del mismo grupo nutricional y planificar comidas diarias y semanales. Todo 100% local-first (los datos nunca salen del dispositivo del usuario).

## Positioning

Una herramienta de Food Intelligence limpia, local-first y sin fricción: sin registro forzado, sin publicidad invasiva, con cálculo aritmético exacto y diseño premium enfocado en la usabilidad real tanto en móvil (a una mano en la cocina o supermercado) como en escritorio.

## Operating Context

- **Móvil (a una mano):** En la cocina midiendo una taza o en el supermercado decidiendo qué comprar como equivalente de otro alimento. Requiere controles táctiles generosos, contrastes nítidos y respuestas instantáneas.
- **Escritorio:** En consulta o en casa planificando los menús de la semana, imprimiendo o exportando planes. Requiere vista amplia, atajos y navegación ágil.

## Capabilities and Constraints

- **17 grupos de alimentos** equivalentes normalizados con tokens de color distintivos.
- **Aritmética fraccionaria y pesos en gramos:** cálculos precisos basados en porción de referencia.
- **Comparador inteligente:** únicamente permite comparar alimentos del mismo grupo para garantizar validez nutricional.
- **Planificador diario y semanal:** registro de comidas (Desayuno, Colaciones, Comida, Cena) con IndexedDB.
- **Local-first y offline:** almacenamiento en navegador (localStorage e IndexedDB), importación/exportación JSON.
- **Soporte completo Responsive y Dark Mode:** tema claro y oscuro con estándares WCAG AA/AAA.

## Brand Commitments

- **Nombre:** NutriDex (Desarrollado con tecnología ThinkBase).
- **Voz:** Clara, técnica pero accesible, alentadora, honesta (no inventa datos nutricionales no documentados).
- **Estilo:** HealthTech moderno, fresco, precisión clínica combinada con calidez orgánica.

## Product Principles

1. **Claridad sobre volumen:** Mostrar la porción equivalente y los gramos sin saturar con números innecesarios.
2. **Cero fricción:** Toda acción primaria (buscar, calcular, cambiar porción, comparar) debe estar a un toque o clic de distancia.
3. **Respeto a la evidencia clínica:** Indicar con transparencia el origen del dato y advertir que no sustituye el diagnóstico profesional.
4. **Respuesta inmediata:** Interacciones instantáneas, animaciones fluidas con propósito y navegación adaptada a cada pantalla.
