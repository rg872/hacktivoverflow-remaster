const User = require('../models/users.model')  
const Question = require('../models/questions.model') 
const Answer = require('../models/answers.model') 

module.exports = {
    getAllQuestions (req, res) {
        Question.find({})
        .populate({
            path: 'answers',
            populate: {
                path: 'user',
                select: 'email'
            }
        })
        .populate('user', 'email')
        .then(questions => {
            res.status(200).json({
                message: 'success get all questions',
                questions
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    getQuestionsByEmail (req, res) {
        let { email } = req.payload

        User.findOne({email})
        .populate({
            path: 'questions',
            populate: {
                path: 'answers',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            }
        })
        .populate('user', 'email')
        .then(user => {
            res.status(200).json({
                message: 'success get question by email',
                questions: user.questions
            })
        })
        .catch(err => {
            res.status().json({
                message: err.message
            })
        })

    },

    getAllAnswers (req, res) {
        Answer.find({})
        .populate('user', 'email')
        .then(answers => {
            res.status(200).json({
                message: 'success get all answers',
                answers
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    getAnswersByEmail (req, res) {
        let { email } = req.payload

        User.findOne({email})
        .populate({
            path: 'questions',
            populate: {
                path: 'answers',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            }
        })
        .then(user => {
            res.status(200).json({
                message: 'success get answer by email',
                questions: user.questions
            })
        })
        .catch(err => {
            res.status().json({
                message: err.message
            })
        })

    },
    createQuestion (req, res) {
        let { email } = req.payload        
        
        User.findOne({email})
        .then(user => {
            let addition = {
                vote: 0,
                voters: [],
                answers: [],
                user:user._id
            }
            req.body = Object.assign(addition, req.body)
    
            let new_question = new Question(req.body)
            let error = new_question.validateSync()
    
            if(error) {
                res.status(400).json({
                    message: error.message
                })
            } else {
                new_question.save()
                .then(question => {
                    User.findByIdAndUpdate(user._id, {$push: {questions: question._id}})
                    .then(user => {
                        let opts = [
                            {
                                path: 'answers',
                                populate: {
                                    path: 'user',
                                    select: 'email'
                                }
                            },
                            {
                                path: 'user',
                                select: 'email'
                            }
                        ]
                        Question.populate(question, opts, (err, question) => {
                            res.status(200).json({
                                message: 'success create question',
                                question
                            })
                        })
                    })
                })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: err.message
            })
        })
    },

    voteQuestion (req, res) {
        let { email } = req.payload
        let { vote } = req.body
        let id = req.params.id

        User.findOne({email})
        .then(user => {
            Question.findByIdAndUpdate(id, {$push: {voters: user._id}, vote})
            .populate({
                path: 'answers',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            })
            .populate('user', 'email')
            .then(question => {
                res.status(200).json({
                    message: 'succes voting question',
                    question
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    updateQuestion (req, res) {
        let id = req.params.id

        Question.findByIdAndUpdate(id, req.body)
        .populate({
            path: 'answers',
            populate: {
                path: 'user',
                select: 'email'
            }
        })
        .populate('user', 'email')
        .then(question => {
            res.status(200).json({
                message: 'success update question',
                question
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    deleteQuestion (req, res) {
        let id = req.params.id
        let { email } = req.payload

        Question.findByIdAndRemove(id)
        .then(() => {
            User.findOneAndUpdate({email}, {$pull: {questions: id}})
            .then(user =>{
                res.status(200).json({
                    message: 'success delete question'
                })
            })
        })
        .catch(err => {
            res.status.json({
                message: err.message 
            })
        })
    },

    answerQuestion (req, res) {
        let { email } = req.payload
        let id = req.params.id

        User.findOne({email})
        .then(user => {
            let addition = {
                vote: 0,
                voters: [],
                user: user._id
            }
            req.body = Object.assign(addition, req.body)
            let new_answer = new Answer(req.body)
            let error = new_answer.validateSync()
            if(error) {
                console.log(error);
                
                res.status(400).json({
                    message: error.message
                })
            } else {
                new_answer.save()
                .then(answer => {
                    Question.findByIdAndUpdate(id, {$push: {answers: answer._id}})
                    .populate({
                        path: 'answers',
                        populate: {
                            path: 'user',
                            select: 'email'
                        }
                    })
                    .populate('user', 'email')
                    .then(question => {
                        res.status(200).json({
                            message: 'success create answer',
                            question
                        })
                    })
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    voteAnswer (req, res) {
        let { email } = req.payload
        let { vote } = req.body
        let id = req.params.id

        User.findOne({email})
        .then(user => {
            Answer.findByIdAndUpdate(id, {$push: {voters: user._id}, vote})
            .populate('user', 'email')
            .then(answer => {
                res.status(200).json({
                    message: 'succes voting answer',
                    answer
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    updateAnswer (req, res) {
        let id = req.params.id

        Answer.findByIdAndUpdate(id, req.body)
        .populate('user', 'email')
        .then(answer => {
            res.status(200).json({
                message: 'success answer answer',
                answer
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    },

    deleteAnswer (req, res) {
        let answerId = req.params.aid
        let questionId = req.params.qid
        let { email } = req.payload

        Answer.findByIdAndRemove(answerId)
        .then(() => {
            Question.findByIdAndUpdate(questionId, {$pull: {answers: answerId}})
            .populate({
                path: 'answers',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            })
            .populate('user', 'email')
            .then(question =>{
                res.status.json({
                    message: 'success delete answer',
                    question
                })
            })
        })
        .catch(err => {
            res.status.json({
                message: err.message 
            })
        })
    },

}