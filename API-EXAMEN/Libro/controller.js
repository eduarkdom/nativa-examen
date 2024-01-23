const validator = require('validator');
const Libro = require('./libroModel');
const multer = require('multer');
const upload = require('./multer_config');
const fs = require('fs');
const path = require('path');

const controller = {
    checkRequestBody: (req, res, next) => {
        if (req.method === 'POST' && Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requiere un body para el método POST en esta ruta'
            });
        }
        next();
    },

    saveLibro: async (req, res) => {
        try {
            const params = req.body;

            const isbnRegex = /^\d{3}-\d{10}$/;

            if (
                !params.ISBN ||
                !validator.matches(params.ISBN, isbnRegex) ||
                validator.isEmpty(params.ISBN) ||
                !params.nombreLibro ||
                !validator.isLength(params.nombreLibro, { min: 1 }) ||
                validator.isEmpty(params.nombreLibro) ||
                !params.autor ||
                !validator.isLength(params.autor, { min: 1 }) ||
                validator.isEmpty(params.autor) ||
                !params.editorial ||
                !validator.isLength(params.editorial, { min: 1 }) ||
                validator.isEmpty(params.editorial) ||
                !params.paginas ||
                isNaN(params.paginas) ||
                !validator.isInt('' + params.paginas) ||
                params.paginas <= 0
            ) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Datos inválidos. Asegúrate de proporcionar y validar todos los campos (ISBN, nombreLibro, autor, editorial, paginas).'
                });
            }

            const libro = new Libro({
                ISBN: params.ISBN,
                nombreLibro: params.nombreLibro,
                autor: params.autor,
                editorial: params.editorial,
                paginas: params.paginas,
                portada: params.portada || null
            });

            const savedLibro = await libro.save();
            return res.status(200).send({
                status: 'success',
                libro: savedLibro
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 'error',
                message: 'Imposible guardar los datos del libro en la base de datos'
            });
        }
    },
    
    updateLibro: async (req, res) => {
        try {
            const id = req.params.id;
            const params = req.body;
    
            const isbnRegex = /^\d{3}-\d{10}$/;
    
        
            if (
                !params.ISBN ||
                !validator.matches(params.ISBN, isbnRegex) ||
                validator.isEmpty(params.ISBN) ||
                !params.nombreLibro ||
                !validator.isLength(params.nombreLibro, { min: 1 }) ||
                validator.isEmpty(params.nombreLibro) ||
                !params.autor ||
                !validator.isLength(params.autor, { min: 1 }) ||
                validator.isEmpty(params.autor) ||
                !params.editorial ||
                !validator.isLength(params.editorial, { min: 1 }) ||
                validator.isEmpty(params.editorial) ||
                !params.paginas ||
                isNaN(params.paginas) ||
                !validator.isInt('' + params.paginas) ||
                params.paginas < 0
            ) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Datos inválidos. Asegúrate de proporcionar y validar todos los campos (ISBN, nombreLibro, autor, editorial, paginas).'
                });
            }
    
            const updatedLibro = await Libro.findByIdAndUpdate(id, params, { new: true });
    
            if (!updatedLibro) {
                return res.status(404).send({
                    status: 'error',
                    message: `El libro con id: ${id} no existe`
                });
            }
    
            return res.status(200).send({
                status: 'success',
                libro: updatedLibro
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar el libro'
            });
        }
    },
    
    deleteLibro: async (req, res) => {
        try {
            const id = req.params.id;
            const libro = await Libro.findByIdAndDelete(id);
    
            if (!libro) {
                return res.status(404).send({
                    status: 'error',
                    message: `El libro con id: ${id} no existe`
                });
            }
    
            return res.status(200).send({
                status: 'success',
                message: 'Libro Eliminado exitosamente',
                libro
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar el libro'
            });
        }
    },
    
    getLibroById: async (req, res) => {
        var id = req.params.id;
    
        try {
            if (!id || id == null) {
                return res.status(400).send({
                    status: 'error',
                    message: 'No se ha proporcionado ID'
                });
            }
    
            const libro = await Libro.findById(id);
    
            if (!libro) {
                return res.status(404).send({
                    status: 'error',
                    message: `El libro con id: ${id} no existe`
                });
            }
    
            return res.status(200).send({
                status: 'success',
                libro
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del Servidor'
            });
        }
    },
    
    getAllLibros: (req, res) => {
        var { last } = req.params;
    
        if (last && !isNaN(parseInt(last))) {
            var query = Libro.find({}).sort('-_id').limit(parseInt(last));
    
            query.then(libros => {
                if (!libros || libros.length === 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se han encontrado libros'
                    });
                }
    
                return res.status(200).send({
                    status: 'success',
                    libros
                });
            }).catch(err => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error interno del Servidor'
                });
            });
        } else {
            Libro.find({}).sort('-_id')
                .then(libros => {
                    if (!libros || libros.length === 0) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No se han encontrado libros'
                        });
                    }
    
                    return res.status(200).send({
                        status: 'success',
                        libros
                    });
                }).catch(err => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error interno del Servidor'
                    });
                });
        }
    },

    searchLibros: async (req, res) => {
        try {
            const searchParams = req.query;
            const query = {};
    
            const validSearchParams = [
                'ISBN',
                'nombreLibro',
                'autor',
                'editorial',
                'portada',
                'paginas',
            ];
            const invalidParams = [];
    
            for (const key in searchParams) {
                if (!validSearchParams.includes(key)) {
                    invalidParams.push(key);
                } else {
                    query[key] = searchParams[key];
                }
            }
    
            if (invalidParams.length > 0) {
                return res.status(400).send({
                    status: 'error',
                    message: `Los siguientes parámetros no son válidos para la búsqueda de libros: ${invalidParams.join(', ')}`
                });
            }
    
            const libros = await Libro.find(query).sort({ createdAt: 'descending' });
    
            if (!libros || libros.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontraron libros con los criterios proporcionados'
                });
            }
    
            return res.status(200).send({
                status: 'success',
                libros
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al buscar documentos'
            });
        }
    },
    
    uploadPhoto: async (req, res) => {
        try {
            upload(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    console.error('MulterError:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'Error al cargar el archivo',
                        error: err.message
                    });
                } else if (err) {
                    console.error('Internal server error during file upload:', err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error interno del servidor al cargar el archivo',
                        error: err.message
                    });
                }
    
                const file = req.file;
                const id = req.params.id;
    
                if (!file) {
                    console.error('File not found in request');
                    return res.status(404).json({
                        status: 'error',
                        message: 'El archivo no puede estar vacío o la extensión del archivo no está permitida'
                    });
                }
    
                console.log('File uploaded successfully:', file);
    
                if (id) {
                    const updatedLibro = await Libro.findByIdAndUpdate(
                        { _id: id },
                        { portada: file.filename },
                        { new: true }
                    );
    
                    if (!updatedLibro) {
                        console.error(`Error updating libro with _id: ${id}`);
                        return res.status(400).json({
                            status: 'error',
                            message: `La imagen no se pudo guardar en el documento con _id: ${id}`
                        });
                    }
    
                    console.log('Libro updated successfully:', updatedLibro);
    
                    return res.status(200).json({
                        status: 'success',
                        message: '¡Carga de archivo y actualización de foto de libro exitoso!',
                        filename: file.filename,
                        libro: updatedLibro
                    });
                } else {
                    console.error('ID is required to update libro photo');
                    return res.status(400).json({
                        status: 'error',
                        message: 'Se requiere un ID para actualizar la foto del libro'
                    });
                }
            });
        } catch (error) {
            console.error('Internal server error during file upload:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al cargar el archivo',
                error: error.message
            });
        }
    },
    
    
    

    getPhoto: (req, res) => {
        var file = req.params.filename;
        var pathFile = path.join(__dirname, 'uploads', file); 
    
        if (fs.existsSync(pathFile)) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).send({
                status: 'error',
                message: `No se encontró la imagen con el nombre: ${file}`
            });
        }
    }
    
}

module.exports = controller;