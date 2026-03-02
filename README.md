# Casa Tunkul - Sitio elegante listo para DigitalOcean

Proyecto estatico (HTML/CSS/JS) optimizado para conversion con motor de reserva Cloudbeds.

## Archivos

- `index.html`: estructura principal del sitio
- `styles.css`: estilo visual premium + responsive
- `script.js`: menu, animaciones y carga de contenido editable
- `site-config.js`: configuracion base + persistencia en localStorage
- `admin.html`: panel para editar habitaciones y areas comunes
- `admin.css`: estilos del panel admin
- `admin.js`: logica del panel admin
- `assets/images/`: fotos del hotel

## Panel Admin

Abre:
- `./admin.html`

Desde ahi puedes editar:
- 3 habitaciones (titulo, textos, foto principal, galeria)
- areas comunes (titulo, 2 parrafos, galeria)

## Subida de imagenes desde computadora

Cada campo de imagen tiene boton `Subir imagen`.

Flujo:
1. Clic en `Subir imagen`.
2. Elige archivo desde tu computadora.
3. Se comprime automaticamente para web.
4. Clic en `Guardar cambios`.
5. Recarga `index.html`.

## Limites actuales

- Habitaciones: hasta **6 fotos por habitacion**.
- Areas comunes: hasta **12 fotos**.

## Importante sobre guardado

- El panel guarda en `localStorage` del navegador actual.
- Es ideal para administrar rapido en un sitio estatico.
- Si usas otro navegador/dispositivo, no vera esos cambios automaticamente.
- Puedes usar `Exportar JSON` para respaldo.

## Cloudbeds

Widget integrado en `index.html`:
- `<script src="https://hotels.cloudbeds.com/widget/load/4yhpKG/vert?newWindow=1"></script>`

## Ejecutar local

```bash
cd /Users/jriveramx/Documents/TUNKUL/tunkul-do-site
python3 -m http.server 8080
```

Abrir:
- `http://localhost:8080/index.html`
- `http://localhost:8080/admin.html`
