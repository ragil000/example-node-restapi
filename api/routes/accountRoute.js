const express = require('express')
const { route } = require('../../app')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.get('/details/:id', accountController.account_detailsGet)

router.get('/:page/:limit', accountController.account_get)
router.get('/:page', accountController.account_get)
router.get('/', accountController.account_get)

router.post('/', accountController.account_post)

router.put('/:id', accountController.account_put)

router.delete('/:id', accountController.account_delete)

module.exports = router