const express = require('express')
const router = express.Router()
const { getContent, updateContent } = require('../controllers/contentController')
const { protect, admin } = require('../middleware/auth')

router.route('/:type')
    .get(getContent)
    .put(protect, admin, updateContent)

module.exports = router
