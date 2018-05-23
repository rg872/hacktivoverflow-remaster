const express = require('express')
const router = express.Router()
const { decryptToken } = require('../middlewares/auth.middleware')
const { sendEmail } = require('../controllers/mail.controller')
const {
    answerQuestion,
    createQuestion,
    deleteAnswer,
    deleteQuestion,
    updateAnswer,
    updateQuestion,
    voteAnswer,
    voteQuestion,
    getAllAnswers,
    getAllQuestions,
    getAnswersByEmail,
    getQuestionsByEmail
} = require('../controllers/index.controller')

router.get('/answers', decryptToken, getAllAnswers)
router.get('/questions', decryptToken, getAllQuestions)
router.get('/answers/email', decryptToken, getAnswersByEmail)
router.get('/questions/email', decryptToken, getQuestionsByEmail)
router.post('/questions', decryptToken, createQuestion)
router.post('/answers/:id', decryptToken, answerQuestion)
router.put('/questions/:id', decryptToken, voteQuestion)
router.put('/answers/:id', decryptToken, voteAnswer)
router.delete('/questions/:id', decryptToken, deleteQuestion)
router.post('/email', sendEmail)

module.exports = router
