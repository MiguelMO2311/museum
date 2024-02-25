// Retos. - Obtener un listado de todos los objetos que el museo tiene en préstamo, su localización dentro
// de la exposición, la fecha de expiración de este, la información básica (nombre, apellidos y  email) de 
// la persona que los prestado.

// Obtener de forma ordenada de mayor a menor, el número total de objetos o piezas agrupados por su situación dentro
// de la organización, esto es, cuántos hay expuestos, cuántos en itinerancia y cuántos almacenados.

const mysql = require('mysql2/promise');

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Meneses23',
            database: 'museum'
        });


        // Consulta 1: Listado de objetos en préstamo
        const query1 = `
            SELECT
                piezas.descripcion AS Nombre_Objeto,
                localizacion.tipo AS Localizacion_Exposicion,
                estado_actual_piezas.fecha_devolucion AS Fecha_Expiracion,
                propietarios.nombre AS Nombre_Prestador,
                propietarios.apellidos AS Apellidos_Prestador,
                propietarios.email AS Email_Prestador
            FROM
                piezas
            INNER JOIN
                estado_actual_piezas ON piezas.pieza_id = estado_actual_piezas.estado_actual_pieza_id
            INNER JOIN
                propietarios ON estado_actual_piezas.estado_actual = 'en prestamo' AND estado_actual_piezas.estado_actual_pieza_id = propietarios.propietario_id
            INNER JOIN
                localizacion ON piezas.localizacion_id = localizacion.localizacion_id;
        `;

        // Consulta 2: Número total de objetos por situación
        const query2 = `
            SELECT
                localizacion.tipo AS Situacion,
                COUNT(*) AS Total_Objetos
            FROM
                piezas
            INNER JOIN
                localizacion ON piezas.localizacion_id = localizacion.localizacion_id
            GROUP BY
                localizacion.tipo
            ORDER BY
                Total_Objetos DESC;
        `;

        // Inicia una transacción
        await connection.beginTransaction();

        // Ejecuta las consultas dentro de la transacción
        const [result1] = await connection.execute(query1);
        const [result2] = await connection.execute(query2);

        // Confirma la transacción
        await connection.commit();

        // Cierra la conexión
        connection.end();

        // Devuelve los resultados
        return { objetosEnPrestamo: result1, objetosPorSituacion: result2 };
    } catch (error) {
        // Maneja errores
        console.error('Error en la consulta:', error);
        // Deshacer la transacción en caso de error
        await connection.rollback();
        throw error;
    }
}

// Llama a la función y maneja los resultados
createDatabase()
    .then((results) => {
        console.log('Objetos en préstamo:', results.objetosEnPrestamo);
        console.log('Objetos por situación:', results.objetosPorSituacion);
    })
    .catch((error) => {
        console.error('Error general:', error);
    });











// const mysql = require('mysql2/promise');

// async function createDatabase() {
//     try {
//         const connection = await mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: 'Meneses23',
//             database: 'museum'
//         });

//         await connection.query('CREATE DATABASE IF NOT EXISTS museum');
//         await connection.query('USE museum');

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS autores (
//                 autor_id INT PRIMARY KEY,
//                 nombre VARCHAR(255),
//                 apellidos VARCHAR(255)
//             )
//         `);

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS exposicion (
//                 exposicion_id INT PRIMARY KEY,
//                 tipo ENUM('permanente', 'almacenada', 'itinerante')
//             )
//         `);

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS propietarios (
//                 propietario_id INT PRIMARY KEY,
//                 nombre VARCHAR(255),
//                 apellidos VARCHAR(255),
//                 email VARCHAR(255),
//                 direccion VARCHAR(255),
//                 tipo ENUM('museo', 'coleccionista', 'otro')
//             )
//         `);

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS localizacion (
//                 localizacion_id INT PRIMARY KEY,
//                 tipo ENUM('expositor', 'vitrina', 'armario', 'estanteria')
//             )
//         `);

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS estado_actual_pieza (
//                 estado_actual_pieza_id INT PRIMARY KEY,
//                 estado_actual ENUM('posesion', 'en prestamo', 'prestada'),
//                 fecha_prestamo DATE,
//                 fecha_devolucion DATE
//             )
//         `);

//         await connection.query(`
//             CREATE TABLE IF NOT EXISTS piezas (
//                 pieza_id INT PRIMARY KEY,
//                 descripcion TEXT,
//                 año YEAR,
//                 autor_id INT,
//                 localizacion_id INT,
//                 propietario_id INT,
//                 estado_actual_pieza_id INT,
//                 exposicion_id INT,
//                 FOREIGN KEY (autor_id) REFERENCES autores(autor_id),
//                 FOREIGN KEY (localizacion_id) REFERENCES localizacion(localizacion_id),
//                 FOREIGN KEY (propietario_id) REFERENCES propietarios(propietario_id),
//                 FOREIGN KEY (estado_actual_pieza_id) REFERENCES estado_actual_pieza(estado_actual_pieza_id),
//                 FOREIGN KEY (exposicion_id) REFERENCES exposicion(exposicion_id)
//             )
//         `);

//         console.log('Tablas creadas con éxito');
//         await connection.end();
//     } catch (error) {
//         console.error('Ha ocurrido un error al crear las tablas:', error);
//     }
// }

// createDatabase();



