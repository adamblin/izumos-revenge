# Izumo's Revenge

Aventura gráfica point & click construida con [Narrat](https://docs.narrat.dev) (Vue + Vite), empaquetable como web o como app de escritorio con Electron.

## Empezar

```bash
pnpm install
pnpm start            # desarrollo con recarga automática
pnpm run type-check   # comprobación de tipos (obligatoria antes de subir)
pnpm run build        # build web en dist/
pnpm run desktop      # build + Electron
```

## Añadir contenido

📖 **[docs/GUIA_CONTENIDO.md](docs/GUIA_CONTENIDO.md)**: diálogos, escenas y hotspots, personajes, objetos, misiones, música y cómo crear capítulos.

## Estructura

| Carpeta | Contenido | Quién la toca |
|---|---|---|
| `src/content/` | Capítulos, personajes y configuración (`.narrat` + `.yaml`) | Equipo narrativo |
| `public/` | Imágenes, audio y fuentes | Arte y sonido |
| `src/game/` | Mecánicas propias (comandos `.narrat` personalizados, plugins) | Programación |
| `src/core/` | Ensamblado del contenido y arranque del motor | Programación |

La arquitectura y los principios de diseño están explicados en la [sección 13 de la guía](docs/GUIA_CONTENIDO.md#13-para-programadores).
