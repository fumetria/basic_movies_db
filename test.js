const jwt = require('jsonwebtoken');

// Token proporcionado
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2NzJiZjJhMjFmMTFiZDEzMjUxZGIzNTEiLCJpYXQiOjE3MzEzMzc1MzUsImV4cCI6MTczMTM0MTEzNX0.dpcDUf-0e-iDK24dfnhtmTrbkqtuCV0dP65aboc8npI';

// Clave secreta usada para firmar el token
// const secretKey = 'mysecretKey';
const secretKey = process.env.SECRET_KEY;

try {
    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.decode(token);

    // Mostrar el contenido del token decodificado
    // console.log('Contenido del token:', decoded);
    console.log('Username:', decoded.username);
    console.log('ID:', decoded.id);
    console.log('Fecha de creación (iat):', new Date(decoded.iat * 1000).toLocaleString());
    console.log('Fecha de expiración (exp):', new Date(decoded.exp * 1000).toLocaleString());
} catch (err) {
    console.error('Error al decodificar el token:', err.message);
}
