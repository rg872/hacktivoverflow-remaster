import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import register from './pages/RegisterPage.vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isMenuOpen: false,
    pageStack: [register],
    questions: []
  },
  mutations: {
    nextPage (state, page) {
      state.pageStack.push(page)
    },
    backPage (state, page) {
      state.pageStack.splice(1, state.pageStack.length - 1)
    },
    changePage (state, page) {
      state.pageStack = [page]
    },
    menuOpen (state) {
      state.isMenuOpen = !state.isMenuOpen
    },
    setAllQuestions (state, questions) {
      state.questions = questions
    },
    setNewQuestion (state, question) {
      state.questions.push(question)
    },
    deleteQuestion (state, question) {
      let index = state.questions.indexOf(question)
      state.questions.splice(index, 1)
    },
    updateQuestion (state, question) {
      let index = state.questions.forEach((q, i) => {
        if (q._id === question._id) return i
      })
      state.questions.splice(index, 1, question)
    }
  },
  actions: {
    signUp ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/users/signup', payload)
          .then((response) => {
            localStorage.setItem('token', response.headers.token)
            localStorage.setItem('id', response.data.id)
            resolve()
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    signIn ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/users/signin', payload)
          .then((response) => {
            localStorage.setItem('token', response.headers.token)
            localStorage.setItem('id', response.data.id)
            resolve()
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },

    oAuth ({commit}, email) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/users/oauth', {email})
          .then((response) => {
            localStorage.setItem('token', response.headers.token)
            localStorage.setItem('id', response.data.id)
            resolve()
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },

    getAllQuestions ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/questions', 
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            commit('setAllQuestions', res.data.questions)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    createQuestion ({commit}, question) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/questions', question,
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            commit('setNewQuestion', res.data.question)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteQuestion ({commit}, question) {
      return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3000/questions/${question._id}`,
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            commit('deleteQuestion', question)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    createAnswer ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/answers/${payload.id}`, payload.answer,
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            dispatch('getAllQuestions')
              .then(resolve())
              .catch(err => {
                reject(err)
              })
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    voteAnswer ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3000/answers/${payload.id}`, payload.vote,
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            dispatch('getAllQuestions')
              .then(resolve())
              .catch(err => {
                reject(err)
              })
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    voteQuestion ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3000/questions/${payload.id}`, payload.vote,
          {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(res => {
            dispatch('getAllQuestions')
              .then(resolve())
              .catch(err => {
                reject(err)
              })
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
})
