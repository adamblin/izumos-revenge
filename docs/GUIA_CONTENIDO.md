# Guía de contenido: Izumo's Revenge

Esta guía explica cómo añadir contenido al juego (diálogos, fondos, personajes, objetos, misiones, música) **sin tocar código TypeScript**. Al final hay una sección para quien programe y quiera añadir mecánicas nuevas.

> **Regla de oro:** el contenido vive en `src/content/` (texto y configuración) y en `public/` (imágenes y audio). Si estás escribiendo historia y te encuentras editando algo en `src/core/` o `src/game/`, para y pregunta.

---

## Índice

1. [Arrancar el juego](#1-arrancar-el-juego)
2. [Dónde va cada cosa](#2-dónde-va-cada-cosa)
3. [Convenciones obligatorias](#3-convenciones-obligatorias)
4. [Imágenes](#4-imágenes)
5. [Personajes](#5-personajes)
6. [Diálogos (scripts `.narrat`)](#6-diálogos-scripts-narrat)
7. [Escenas y hotspots (point & click)](#7-escenas-y-hotspots-point--click)
8. [Objetos e inventario](#8-objetos-e-inventario)
9. [Misiones](#9-misiones)
10. [Música y efectos de sonido](#10-música-y-efectos-de-sonido)
11. [Crear un capítulo nuevo](#11-crear-un-capítulo-nuevo)
12. [Probar y resolver errores](#12-probar-y-resolver-errores)
13. [Para programadores](#13-para-programadores)

---

## 1. Arrancar el juego

```bash
pnpm install     # solo la primera vez (o npm install)
pnpm start       # abre el juego en el navegador con recarga automática
```

- Los cambios en archivos `.narrat` se aplican al momento.
- Los cambios en archivos `.yaml` **requieren recargar la página (F5)**.
- Antes de subir cambios, ejecuta `pnpm run type-check`. Si falla, no subas.

---

## 2. Dónde va cada cosa

```
src/content/
├── index.ts                  ← lista de capítulos registrados (añadir aquí los nuevos)
├── global/                   ← configuración general (título, fuentes, idiomas, menú...)
│   ├── config/*.yaml
│   └── scripts/main.narrat   ← punto de entrada: decide qué capítulo va primero
├── characters/               ← el reparto: un .yaml por personaje
│   ├── characters.yaml       ← narrador y jugador
│   ├── izumo.yaml
│   └── index.ts              ← registrar aquí cada personaje nuevo
└── chapters/
    ├── _template/            ← plantilla para copiar (NO está registrada)
    └── ch01-prologue/        ← un capítulo = una carpeta autocontenida
        ├── index.ts          ← qué scripts y qué yaml forman el capítulo
        ├── config/
        │   ├── screens.yaml  ← escenas (fondo + hotspots)
        │   ├── buttons.yaml  ← hotspots clicables
        │   ├── items.yaml    ← objetos del capítulo
        │   ├── quests.yaml   ← misiones del capítulo
        │   └── audio.yaml    ← música y sonidos del capítulo
        └── scripts/
            ├── intro.narrat
            └── room.narrat

public/                       ← archivos que el juego carga tal cual
├── img/backgrounds/chXX/     ← fondos de escena
├── img/characters/<id>/      ← retratos por personaje y pose
├── img/items/chXX/           ← iconos de objetos
└── audio/music/  audio/sfx/  ← música y efectos
```

| Quiero... | Edito |
|---|---|
| Escribir o cambiar diálogo | `chapters/chXX-*/scripts/*.narrat` |
| Añadir un fondo / escena | imagen en `public/img/backgrounds/chXX/` + `config/screens.yaml` |
| Hacer clicable una zona | `config/buttons.yaml` + la escena en `screens.yaml` |
| Añadir un personaje | `characters/<id>.yaml` + `characters/index.ts` + retratos en `public/img/characters/<id>/` |
| Añadir un objeto | `config/items.yaml` + icono en `public/img/items/chXX/` |
| Añadir una misión | `config/quests.yaml` |
| Añadir música | archivo en `public/audio/` + `config/audio.yaml` |
| Cambiar el título del juego o la velocidad del texto | `global/config/common.yaml` |

---

## 3. Convenciones obligatorias

Todos los identificadores (escenas, hotspots, objetos, misiones, etiquetas de diálogo) son **globales en todo el juego**. Para que dos capítulos nunca choquen:

| Regla | Ejemplo correcto | Incorrecto |
|---|---|---|
| Prefijo del capítulo en todo ID | `ch02_harbour`, `ch02_old_map` | `harbour`, `map` |
| `snake_case`, sin espacios, sin tildes ni ñ | `ch02_fisherman_talk` | `ch02 Pescador-Charla` |
| Hotspots: `<escena>_<cosa>` | `ch02_harbour_boat` | `boat1` |
| Etiquetas de hotspot: `chXX_hotspot_<cosa>` | `ch02_hotspot_boat` | `click_boat` |
| Personajes: sin prefijo (son de todo el juego) | `izumo`, `kenji` | `ch01_izumo` |
| Archivos de imagen y audio: minúsculas | `harbour_night.webp` | `Harbour Night.PNG` |

Si dos archivos definen el mismo ID, el juego **no arranca** y la consola muestra exactamente qué ID está repetido y en qué dos archivos (ver [sección 12](#12-probar-y-resolver-errores)).

---

## 4. Imágenes

| Tipo | Carpeta | Tamaño recomendado | Formato |
|---|---|---|---|
| Fondo de escena | `public/img/backgrounds/chXX/` | **1280 × 720** exactos | `.webp` (o `.png`/`.jpg`) |
| Retrato de personaje | `public/img/characters/<id>/` | cuadrado, 256 × 256 o más | `.webp`/`.png` con transparencia |
| Icono de objeto | `public/img/items/chXX/` | cuadrado, 128 × 128 | `.webp`/`.png` con transparencia |

**Cómo se escriben las rutas en los `.yaml`:** siempre relativas a `public/` y **sin** escribir `public/`:

```yaml
background: img/backgrounds/ch02/harbour.webp   # ✔
background: public/img/backgrounds/ch02/harbour.webp   # ✘
```

Los archivos `.svg` que hay ahora en `public/img/` son **marcadores de posición**: sustitúyelos por el arte final y actualiza la extensión en el `.yaml` correspondiente.

> Los hotspots se colocan con coordenadas en píxeles **del fondo de 1280 × 720**. Si un fondo tiene otro tamaño, las zonas clicables no coincidirán con el dibujo.

### 4.1 Dirección de arte: ukiyo-e

Todo el juego imita una **estampa japonesa en madera** (ukiyo-e). Para que el arte nuevo encaje con la interfaz:

| Rasgo | Cómo aplicarlo |
|---|---|
| Color plano | Sin sombreados realistas; cada zona, un color liso. |
| Contorno de tinta | Línea oscura (*sumi*) de grosor constante alrededor de cada forma. |
| *Bokashi* | El único degradado permitido: suave, de arriba abajo, típicamente en cielos (azul → papel). |
| *Kasumi* | Bandas horizontales de bruma color papel/ocre para separar planos. |
| Papel | Fondos con tono crema y algo de grano, nunca blanco puro. |
| Retratos | Estilo *bijin-ga*: rostro claro, ojos y cejas de trazo fino, pelo negro plano. |

Paleta oficial (son las mismas variables que usa la interfaz, en [src/css/main.css](../src/css/main.css)):

| Nombre | Color | Uso |
|---|---|---|
| *Washi* (papel) | `#efe4cc` / `#e2d2ae` | fondos, papel, cajas de diálogo |
| *Sumi* (tinta) | `#221c18` | contornos y texto |
| *Bero-ai* (azul de Prusia) | `#23436c` / `#4f6f99` | cielo, agua, kimonos |
| *Shu* (bermellón) | `#b8382a` | sol, sellos, acentos, elementos interactivos |
| *Kincha* (ocre) | `#b8862b` | metal, madera clara, detalles |
| *Matsuba* (verde pino) | `#4d6b4a` | vegetación |

Tipografías de la interfaz: **Yuji Syuku** (títulos y botones) y **Shippori Mincho** (texto), ambas con licencia OFL en `public/fonts/`. Para cambiar el aspecto de todo el juego basta con modificar los colores del bloque *Palette* de `main.css`.

> El bermellón está reservado para lo **interactivo** (esquinas y sello de los hotspots, decisiones, nombres). Evita usarlo en zonas grandes del fondo para que el jugador no confunda decorado con objetos clicables.

---

## 5. Personajes

### 5.1 Crear un personaje

1. Guarda los retratos en `public/img/characters/kenji/` (una imagen por pose: `idle.webp`, `angry.webp`...).
2. Crea `src/content/characters/kenji.yaml`:

   ```yaml
   characters:
     kenji:
       name: Kenji
       style:
         color: '#5aa0e0'      # color del nombre en el diálogo
       sprites:
         idle: kenji/idle.webp     # ruta relativa a img/characters/
         angry: kenji/angry.webp
   ```

3. Regístralo en `src/content/characters/index.ts`:

   ```ts
   import izumo from "./izumo.yaml";
   import kenji from "./kenji.yaml";   // ← nueva línea

   // ...
   characters: [characters, izumo, kenji],   // ← añadido a la lista
   ```

### 5.2 Personajes especiales

- `game`: el **narrador**. Cualquier línea de texto suelta la dice él.
- `player`: el jugador. Es quien "dice" las opciones elegidas en un menú de decisiones.

---

## 6. Diálogos (scripts `.narrat`)

Los diálogos se escriben en archivos `.narrat`. Es un lenguaje muy sencillo basado en **sangría** (como Python).

### 6.1 Reglas de formato

- Sangría de **2 espacios** siempre (nunca tabuladores).
- Cada bloque empieza con una **etiqueta** (`label`) terminada en `:` sin sangría.
- Los comentarios empiezan con `//`. ⚠️ Todo lo que vaya después de `//` en una línea se ignora, **incluso dentro de un texto**: no escribas URLs (`https://...`) en un diálogo.
- No termines una línea de comentario con `:`.

### 6.2 Lo básico

```narrat
ch02_start:
  "Texto del narrador. Sale sin nombre."
  talk izumo idle "Esto lo dice Izumo con la pose idle."
  think izumo idle "Esto lo piensa Izumo (no lo dice en voz alta)."
  talk kenji angry "¡Y esto Kenji enfadado!"
```

Formato: `talk <personaje> <pose> "texto"`. La pose debe existir en el `.yaml` del personaje.

El cuadro funciona como una **viñeta**: muestra solo la línea actual, centrada y con el nombre de quien habla encima. Cada línea nueva sustituye a la anterior, así que escribe frases que se entiendan solas y evita párrafos largos (caben unas 2–3 líneas). El jugador puede releer lo anterior con el botón **History**.

### 6.3 Decisiones

```narrat
ch02_fisherman:
  choice:
    talk kenji idle "¿Me ayudarás o no?"      // la pregunta (opcional)
    "Te ayudaré":
      set data.ch02_helped_kenji true
      talk kenji idle "Gracias."
    "Ahora no":
      talk kenji angry "Como quieras."
    "Darle el mapa" if (has_item? ch02_old_map 1):   // solo aparece si se cumple
      remove_item ch02_old_map 1
      jump ch02_map_given
```

### 6.4 Variables y condiciones

Las variables de historia se guardan en `data.` y se leen con `$data.`. Se guardan automáticamente con la partida.

```narrat
  set data.ch02_coins 3            // asignar
  add data.ch02_coins 2            // sumar
  set data.ch02_helped_kenji true

  if $data.ch02_helped_kenji:
    talk kenji idle "Amigo mío."
  else:
    talk kenji idle "¿Tú otra vez?"

  if (>= $data.ch02_coins 5):
    "Tienes suficiente dinero."
```

Operadores disponibles (siempre entre paréntesis y delante): `==` `!=` `>` `<` `>=` `<=` `!` `&&` `||`.
Ejemplo: `if (&& $data.ch02_helped_kenji (has_item? ch02_old_map 1)):`

Prefija también las variables con el capítulo (`data.ch02_...`) para no pisar las de otro capítulo.

### 6.5 Saltar entre etiquetas

| Comando | Qué hace |
|---|---|
| `jump ch02_end` | Va a esa etiqueta y **no vuelve**. |
| `run ch02_common_reaction` | Ejecuta esa etiqueta y **vuelve** a la línea siguiente (como una subrutina). |

### 6.6 Otros comandos útiles

```narrat
  wait 1000                        // pausa de 1 segundo
  clear_dialog                     // limpia el cuadro (ya se hace solo en cada línea)
  notify "Has aprendido algo"      // aviso emergente
  set_screen ch02_harbour          // cambia de escena (ver sección 7)
```

### 6.7 Tooltips (palabras con explicación)

Define la palabra en `src/content/global/config/tooltips.yaml`:

```yaml
tooltips:
  - keywords: [kami]
    title: Kami
    description: Espíritu o divinidad del sintoísmo.
```

Y úsala en un diálogo así: `"Dicen que aquí vive un @t{kami}@."`

---

## 7. Escenas y hotspots (point & click)

Una **escena** (`screen`) es un fondo más las zonas clicables (**hotspots**) que tiene encima.

### 7.1 Crear la escena

`config/screens.yaml`:

```yaml
screens:
  ch02_harbour:
    background: img/backgrounds/ch02/harbour.webp
    buttons:
      - ch02_harbour_boat
      - ch02_harbour_fisherman
```

### 7.2 Crear los hotspots

`config/buttons.yaml`:

```yaml
buttons:
  ch02_harbour_boat:
    enabled: true
    text: Barca                    # etiqueta que aparece al pasar el ratón
    cssClass: hotspot              # esquinas bermellón + sello que late; al pasar el ratón, borde y nombre
    position: { left: 120, top: 400, width: 300, height: 180 }
    action: ch02_hotspot_boat      # etiqueta .narrat que se ejecuta al hacer clic
```

> Con `cssClass: hotspot` el jugador ve siempre **cuatro esquinas bermellón** que enmarcan la zona y un **sello rojo que late** en el centro, así distingue lo clicable del decorado sin ir buscando con el ratón. Ajusta el rectángulo al objeto (sin márgenes de más) para que las esquinas lo enmarquen bien, y evita que el centro caiga sobre un detalle importante del dibujo, porque ahí se pinta el sello.

**Cómo sacar las coordenadas:** abre el fondo (1280 × 720) en cualquier editor de imagen, pon el cursor en la esquina superior izquierda del objeto (`left`, `top`) y mide su ancho y alto (`width`, `height`).

Si quieres un hotspot con imagen propia (por ejemplo un objeto que desaparece al cogerlo), añade `background: img/...` al botón.

### 7.3 El bucle de exploración

Este es el patrón de toda escena explorable:

```narrat
ch02_harbour_enter:
  set_screen ch02_harbour
  if (visited? ch02_harbour):
    talk izumo idle "El puerto otra vez."
  else:
    talk izumo idle "Así que este es el puerto..."
  mark_visited ch02_harbour
  // la etiqueta termina aquí: el jugador recupera el control y puede hacer clic

ch02_hotspot_boat:
  talk izumo idle "Una barca vieja."
  // termina sin jump: el jugador sigue explorando
```

- **Cuando una etiqueta termina sin `jump`, el control vuelve al jugador** y puede hacer clic en otro hotspot.
- Mientras hay un diálogo en curso, los hotspots no responden.
- `visited?` / `mark_visited` son comandos propios del juego para distinguir la primera visita de las siguientes. Se guardan con la partida.

### 7.4 Activar y desactivar hotspots

```narrat
  set_button ch02_harbour_boat false     // ocultar (p. ej. tras coger el objeto)
  set_button ch02_harbour_boat true      // volver a mostrar
```

Para un hotspot que **no** debe estar visible al principio, pon `enabled: false` en el `.yaml` y actívalo desde el script cuando toque.

### 7.5 Ir de una escena a otra

Crea un hotspot de salida cuya `action` sea la etiqueta de entrada de la otra escena:

```yaml
  ch02_harbour_exit_town:
    enabled: true
    text: Al pueblo
    cssClass: hotspot
    position: { left: 0, top: 200, width: 80, height: 400 }
    action: ch02_town_enter
```

---

## 8. Objetos e inventario

`config/items.yaml`:

```yaml
items:
  ch02_old_map:
    name: Mapa viejo
    description: Un mapa del puerto con una cruz roja.
    icon: img/items/ch02/old_map.webp
    category: key_items           # categoría definida en global/config/items.yaml
    onUse:                        # opcional: qué pasa al usarlo desde el inventario
      action: run
      label: ch02_use_old_map
```

En los scripts:

```narrat
  add_item ch02_old_map 1
  remove_item ch02_old_map 1
  if (has_item? ch02_old_map 1):
    "Tienes el mapa."
```

**Al obtener un objeto** (`add_item`) aparece automáticamente una tarjeta en el centro de la pantalla con su **icono, nombre y descripción** (y "× N" si son varios). No hace falta escribir nada más en el script. La tarjeta se cierra sola a los 3,5 s o al hacer clic, y si se obtienen varios objetos seguidos se muestran uno detrás de otro.

Por eso conviene que cada objeto tenga:

- un **icono cuadrado** legible a 128 × 128 px (es el tamaño al que se ve en la tarjeta);
- una **descripción corta**, de una o dos líneas.

> El texto de cabecera ("Item obtained") y la duración se cambian en `src/game/plugins/index.ts`.

---

## 9. Misiones

`config/quests.yaml`:

```yaml
quests:
  ch02_find_boat:
    title: Una barca para huir
    description: Izumo necesita salir de la isla.
    category: main
    objectives:
      talk_fisherman:
        description: Habla con el pescador.
      get_oars:
        description: Consigue unos remos.
        hidden: true            # no se ve hasta que se inicia
```

En los scripts:

```narrat
  start_quest ch02_find_boat
  start_objective ch02_find_boat get_oars
  complete_objective ch02_find_boat talk_fisherman
  complete_quest ch02_find_boat
  if (objective_completed? ch02_find_boat get_oars):
    "Ya tienes los remos."
```

---

## 10. Música y efectos de sonido

1. Guarda el archivo en `public/audio/music/` o `public/audio/sfx/` (`.mp3` u `.ogg`).
2. Decláralo en el `config/audio.yaml` del capítulo:

   ```yaml
   files:
     ch02_harbour_theme:
       src: audio/music/ch02_harbour_theme.mp3
       loop: true
     ch02_door_creak:
       src: audio/sfx/ch02_door_creak.mp3
   ```

3. Úsalo en los scripts:

   ```narrat
     play music ch02_harbour_theme
     play sound ch02_door_creak
     stop music
   ```

El volumen general y los fundidos se configuran en `src/content/global/config/audio.yaml`.

---

## 11. Crear un capítulo nuevo

1. **Copia** la carpeta `src/content/chapters/_template/` y renómbrala, p. ej. `ch02-harbour`.
2. **Busca y reemplaza** `chXX` por `ch02` en todos los archivos de la carpeta nueva.
3. En `index.ts` del capítulo, cambia `id: "chXX-name"` por `id: "ch02-harbour"` y el comentario de descripción.
4. **Regístralo** en `src/content/index.ts`:

   ```ts
   import prologue from "./chapters/ch01-prologue";
   import harbour from "./chapters/ch02-harbour";   // ← nuevo

   export const contentModules = [global, characters, prologue, harbour];
   ```

5. **Conéctalo con la historia**: al final del capítulo anterior, `jump ch02_start`.
6. Si añades más scripts al capítulo, impórtalos en su `index.ts` y añádelos a `scripts: [...]`. Un archivo `.narrat` que no esté importado **no existe** para el juego.

> Para probar un capítulo directamente sin jugar los anteriores, cambia temporalmente el `jump` de `src/content/global/scripts/main.narrat`. No subas ese cambio.

---

## 12. Probar y resolver errores

Abre la consola del navegador (**F12 → Console**) cuando algo no funcione. En modo desarrollo Narrat también muestra los errores de script en pantalla.

| Síntoma / mensaje | Causa | Solución |
|---|---|---|
| `Config conflict: "buttons.buttons.door..." is defined in both "A" and "B"` | Dos archivos usan el mismo ID | Renombra uno con el prefijo de su capítulo |
| `Unknown command xxx` | Comando mal escrito o falta un `talk` delante | Revisa la ortografía; las líneas de personaje empiezan por `talk` |
| `Wrong double indentation` / `Can't detect indentation level` | Sangría incorrecta | Usa siempre 2 espacios, sin tabuladores |
| `Button X doesn't exist in the config` | `set_button` con un ID que no está en `buttons.yaml` | Revisa el ID |
| Imagen que no aparece (404 en consola) | Ruta mal escrita o con `public/` | Ruta relativa a `public/`, respeta mayúsculas |
| El hotspot no está donde debería | El fondo no mide 1280 × 720 | Reescala el fondo o recalcula coordenadas |
| Cambié un `.yaml` y no pasa nada | Los `.yaml` no se recargan en caliente | Pulsa F5 |
| El capítulo nuevo no aparece | No está registrado en `src/content/index.ts` o falta un `jump` | Ver [sección 11](#11-crear-un-capítulo-nuevo) |
| Un `.narrat` nuevo "no existe" | No está importado en el `index.ts` del capítulo | Impórtalo y añádelo a `scripts` |

**Checklist antes de subir cambios**

- [ ] El juego arranca con `pnpm start` sin errores en consola.
- [ ] He jugado el tramo que he cambiado de principio a fin.
- [ ] Todos mis IDs y variables llevan el prefijo del capítulo.
- [ ] `pnpm run type-check` pasa.
- [ ] No he dejado cambiado el `jump` de `main.narrat` para pruebas.

Documentación completa de comandos de Narrat: <https://docs.narrat.dev>

---

## 13. Para programadores

### 13.1 Arquitectura

```
src/
├── index.ts            Composition root: une contenido + plugins + motor. Nada más.
├── core/               Infraestructura genérica, sin conocimiento de la historia
│   ├── bootstrap.ts                 arranca Narrat a partir de un GameManifest
│   └── content/
│       ├── ContentModule.ts         contrato de un módulo de contenido
│       ├── ContentAssembler.ts      módulos → scripts + config para Narrat
│       ├── ConfigMergeStrategy.ts   abstracción de la estrategia de fusión
│       └── StrictDeepMerge.ts       fusión profunda que falla ante IDs duplicados
├── game/               Mecánicas propias del juego (extensiones del motor)
│   ├── plugins/index.ts             único registro de plugins
│   ├── plugins/SteamPlugin.ts
│   └── visits/                      mecánica "primera visita" (ejemplo de referencia)
│       ├── VisitTracker.ts          dominio puro, sin dependencias de Narrat
│       ├── visitCommands.ts         comandos .narrat (dependen de la interfaz VisitRegistry)
│       ├── visitsStore.ts           persistencia en partidas guardadas
│       └── VisitsPlugin.ts          adaptador que lo registra en Narrat
└── content/            Datos: lo que edita el equipo narrativo
```

Cómo se aplican los principios:

| Principio | Dónde |
|---|---|
| **S**ingle responsibility | `ContentAssembler` ensambla, `StrictDeepMerge` fusiona, `VisitTracker` modela, `VisitsPlugin` adapta, `bootstrap` arranca. |
| **O**pen/closed | Un capítulo, personaje o mecánica nueva se **añade** (carpeta + una línea en una lista); no se modifica código existente. |
| **L**iskov | Cualquier `ConfigMergeStrategy` es intercambiable en `ContentAssembler`. |
| **I**nterface segregation | Los comandos solo ven `VisitRegistry` (`markVisited`/`hasVisited`), no los métodos de guardado del tracker. |
| **D**ependency inversion | `ContentAssembler` depende de la abstracción `ConfigMergeStrategy`; los comandos dependen de `VisitRegistry`. Las dependencias se inyectan por constructor en `createPlugins()`. |

Otras decisiones:

- **CQS** en los comandos: `mark_visited` cambia estado, `visited?` solo consulta. Las consultas acaban en `?`, como las nativas (`has_item?`).
- **Fallo temprano:** IDs duplicados, módulos repetidos o secciones obligatorias ausentes (`common`, `screens`) detienen el arranque con un mensaje claro en lugar de producir comportamientos raros en mitad de una partida.
- El contenido no se referencia entre módulos desde código; solo Narrat los conecta en tiempo de ejecución mediante etiquetas e IDs.

### 13.2 Añadir una mecánica nueva (comando `.narrat` propio)

Usa `game/visits/` como plantilla:

1. **Dominio** (`game/<mecanica>/<Nombre>.ts`): clase TypeScript pura, sin importar `narrat`. Expón una interfaz pequeña con lo que necesitan los comandos.
2. **Comandos** (`<mecanica>Commands.ts`): una función `create...Commands(dep: Interfaz)` que devuelva `CommandPlugin.FromOptions({ keyword, argTypes, runner })`. El `runner` lee `cmd.options.<arg>` y lo que devuelva es el valor de la expresión en el script.
3. **Persistencia** (si el estado debe guardarse): un store de Pinia con acciones `save`/`load` expuesto vía `customStores`.
4. **Plugin** (`<Nombre>Plugin.ts`): extiende `NarratPlugin`, define `pluginId`, `customCommands`, `customStores` y `reset()`.
5. **Registro**: añádelo en `game/plugins/index.ts`.
6. Documenta el comando nuevo en la sección correspondiente de esta guía.

> ⚠️ **Bug conocido de Narrat 4.1.18:** los hooks `save()`/`load()` a nivel de plugin fallan (`Cannot set properties of undefined`) porque el objeto de guardado nunca inicializa su campo `plugins`. Usa siempre `customStores` para persistir estado (ver `visitsStore.ts`). `reset()` del plugin sí funciona.

### 13.3 Añadir una sección de configuración nueva a un módulo

Cualquier clave de `ModuleConfigInput` de Narrat (`achievements`, `skills`, `choices`...) puede repartirse entre varios módulos: añade la clave al objeto `config` del módulo con un array de `.yaml`. Reglas de fusión de `StrictDeepMerge`: los objetos se fusionan por clave, los arrays se concatenan y un mismo valor definido dos veces es un error.
