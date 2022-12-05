const express = require('express')

const router = express.Router()

//verifie authentification 
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

//verifie les routes 
const controller = require('../controllers/controller')

router.get('/', auth, controller.GetAllObjet)
router.post('/', auth, multer, controller.CreateNewObjects)
router.get('/:id', auth, controller.GetOneObjet)
router.put('/:id', auth, multer, controller.ModifyObjet)
router.delete('/:id', auth, controller.DeleteObjet)
router.post('/:id/like', auth, controller.like)


module.exports = router