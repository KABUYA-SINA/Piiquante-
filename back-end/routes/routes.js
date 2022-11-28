const express = require('express')

const router = express.Router()

//verifie authentification 
const auth = require('../middleware/auth')

//verifie les routes 
const controller = require('../controllers/controller')

router.get('/', auth, controller.GetAllObjet)
router.post('/', auth, controller.CreateNewObjects)
router.get('/:id', auth, controller.GetOneObjet)
router.put('/:id', auth, controller.ModifyObjet)
router.delete('/:id', auth, controller.DeleteObjet)


module.exports = router