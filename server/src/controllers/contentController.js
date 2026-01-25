const Content = require('../models/Content')

// @desc    Get content by type
// @route   GET /api/content/:type
// @access  Public
const getContent = async (req, res) => {
    try {
        const { type } = req.params
        let content = await Content.findOne({ type })

        if (!content) {
            // Create default if not exists
            content = await Content.create({ type })
        }

        res.json(content)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update content
// @route   PUT /api/content/:type
// @access  Private (Admin)
const updateContent = async (req, res) => {
    try {
        const { type } = req.params
        const updates = req.body

        const content = await Content.findOneAndUpdate(
            { type },
            {
                $set: {
                    [type]: updates, // Dynamic update based on type (hero, etc)
                    updatedAt: Date.now()
                }
            },
            { new: true, upsert: true }
        )

        res.json(content)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getContent,
    updateContent
}
