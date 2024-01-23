const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://eduardo:admin@cluster0.a2qlgpo.mongodb.net/libreria?retryWrites=true&w=majority')
  .then(() => {
    console.log('Conexión exitosa a MongoDB, base de datos libros');
    
    const server = app.listen(port, () => {
      console.log(`El servidor está en ejecución en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
  });
