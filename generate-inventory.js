const fs = require('fs');
const path = require('path');

// Ruta a la carpeta de fotografías
const fotoDir = path.join(__dirname, 'fotografias');

// Función para obtener todas las carpetas de categorías
function getFotosInventario() {
    const categorias = [];
    
    // Leer todas las carpetas en /fotografias
    const items = fs.readdirSync(fotoDir, { withFileTypes: true });
    
    items.forEach(item => {
        // Solo procesar si es una carpeta (no archivos como .png o .jpg)
        if (item.isDirectory()) {
            const categoryPath = path.join(fotoDir, item.name);
            
            // Leer archivos en la carpeta de categoría
            const archivos = fs.readdirSync(categoryPath);
            
            // Filtrar solo imágenes (jpg, jpeg, png, gif, webp)
            const imagenes = archivos.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            });
            
            // Si hay imágenes, agregar la categoría
            if (imagenes.length > 0) {
                // Agrupar por extensión
                const extensions = {};
                imagenes.forEach(file => {
                    const ext = path.extname(file).toLowerCase().substring(1);
                    extensions[ext] = (extensions[ext] || 0) + 1;
                });
                
                categorias.push({
                    cat: item.name,
                    archivos: imagenes.sort((a, b) => {
                        // Ordenar por número dentro del nombre
                        const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                        const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                        return numA - numB;
                    }),
                    extensions: extensions,
                    total: imagenes.length
                });
            }
        }
    });
    
    return categorias;
}

// Generar el código JavaScript para inventario.js
function generarConfiguracion() {
    const inventario = getFotosInventario();
    
    console.log('✅ Carpetas con fotos encontradas:');
    inventario.forEach(cat => {
        console.log(`   📁 ${cat.cat}: ${cat.total} imágenes`);
    });
    
    // Crear el contenido del archivo
    let contenido = `// Auto-generado por generate-inventory.js
// NO EDITAR MANUALMENTE - ejecuta: node generate-inventory.js

const CATEGORIAS_ACTIVAS = ${JSON.stringify(inventario.map(cat => ({ 
    cat: cat.cat,
    archivos: cat.archivos
})), null, 4)};

// Generar inventario desde los archivos encontrados
const inventario = CATEGORIAS_ACTIVAS.map(cat => ({
    cat: cat.cat,
    archivos: cat.archivos
}));

console.log('Inventario cargado:', CATEGORIAS_ACTIVAS.length, 'categorías activas');
`;
    
    // Escribir el archivo de configuración
    const configPath = path.join(__dirname, 'inventario-auto.js');
    fs.writeFileSync(configPath, contenido);
    
    console.log(`\n✅ Archivo generado: inventario-auto.js`);
    console.log(`📝 Actualiza tu HTML para incluir: <script src="inventario-auto.js"><\/script>`);
    
    return inventario;
}

// Ejecutar generación
generarConfiguracion();
