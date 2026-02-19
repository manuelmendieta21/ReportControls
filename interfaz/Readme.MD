comandos para todos lo que tengan problemas para hacer la configuración inicial del sitio en la última versión:

1. Install tailwindcss and @tailwindcss/cli via npm.

2. Add the @import "tailwindcss"; import to your main CSS file.

En este paso es importante destacar que es necesario tener una estructura incial de nuestro proyecto, ya tailwind ha simplificado mucho el proceso de inicio.

Te recomiendo que desde tu terminal corras el siguiente comando: mkdir src

touch src/input.css

touch index.html

De esta forma tu directorio se verá así:

node_modules/
src/
input.css <-- Este es el archivo clave en donde deberás escribir: @import "tailwindcss";
index.html
package.json
package-lock.json
3. Luego debes correr el siguiente código en tu terminal:

npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch