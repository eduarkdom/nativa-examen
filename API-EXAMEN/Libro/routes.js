const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Test route');
});

router.post('/libro', controller.checkRequestBody, controller.saveLibro);
router.get('/libros', controller.getAllLibros);
router.get('/libros/:last', controller.getAllLibros);

router.get('/libro/id/:id', controller.getLibroById);
router.get('/libro/busqueda', controller.searchLibros);

router.put('/libro/:id', controller.updateLibro);
router.delete('/libro/:id', controller.deleteLibro);

router.post('/libro/upload/:id?', controller.uploadPhoto);
router.get('/libro/archivo/:filename', controller.getPhoto);

module.exports = router;
