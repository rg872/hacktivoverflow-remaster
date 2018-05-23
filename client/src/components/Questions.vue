<template>
    <v-ons-page>
        <v-ons-toolbar>
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('menuOpen')">
          <v-ons-icon icon="fa-align-justify"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">
        Questions List
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="logOut">
          <v-ons-icon icon="fa-sign-out"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>

    <div v-if="!isDetailOn">
        <v-ons-pull-hook :action="loadQuestions" @changestate="state = $event.state">
        <span v-show="state === 'initial'"> Pull to refresh </span>
        <span v-show="state === 'preaction'"> Release </span>
        <span v-show="state === 'action'"> Loading... </span>
    </v-ons-pull-hook>
    <v-ons-list>
      <v-ons-list-item v-for="(question, index) in questions" :key="index" @click="showDetail(question)">
        <div class="left">
          <p>{{ question.vote }}</p>
        </div>
        <div class="center">
          <span class="list-item__title">{{ question.title }}</span>
          <small>By: {{ question.user.email }}</small>
          <br>
          <span class="list-item__subtitle">{{ question.detail }}</span>
          <br>
        </div>
        <div class="right">
          <v-ons-button modifier="outline" @click="deleteQuestion(question)" v-show="id === question.user._id">
              <v-ons-icon icon="fa-trash"></v-ons-icon>
          </v-ons-button>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-fab position="bottom right" @click="isCreateShowed = true">
      <v-ons-icon icon="fa-plus"></v-ons-icon>
    </v-ons-fab>
    <v-ons-dialog cancelable :visible.sync="isCreateShowed">
      <div class="dialog-container">
        <h4>Create New Questions</h4>
        <v-ons-input placeholder="Title" style="margin-bottom:5%;" v-model="newTitle"></v-ons-input>
        <v-ons-input placeholder="Detail" style="margin-bottom:5%;" v-model="newDetail"></v-ons-input>
        <v-ons-button @click="createQuestion">Create</v-ons-button>
      </div>
    </v-ons-dialog>
    </div>
    
    <div v-else>
        <v-ons-list>
            <v-ons-list-item class="question">
        <div class="left thumbs">
          <v-ons-icon icon="fa-arrow-up" @click="votingQuestion(1)"></v-ons-icon>              
          <p style="margin-left: 5%">{{ selectedQUestion.vote }}</p>
          <v-ons-icon icon="fa-arrow-down" @click="votingQuestion(-1)"></v-ons-icon>
        </div>
        <div class="center">
          <span class="list-item__title">{{ selectedQUestion.title }}</span>
          <small>By: {{ selectedQUestion.user.email }}</small>
          <br>
          <span class="list-item__subtitle">{{ selectedQUestion.detail }}</span>
          <br>
        </div>
        <div class="right">
          
        </div>
      </v-ons-list-item>
      <v-ons-list-item v-for="(answer, index) in selectedQUestion.answers" :key="index">
        <div class="left thumbs" style="margin-right: 12%">
           <v-ons-icon icon="fa-arrow-up" @click="votingAnswer(1, answer)"></v-ons-icon>              
          <p style="margin-left: 15%">{{ answer.vote }}</p>
          <v-ons-icon icon="fa-arrow-down" @click="votingAnswer(-1, answer)"></v-ons-icon>
        </div>
        <div class="center">
          <span class="list-item__title">{{ answer.user.email }}</span>
          <small>At: {{ dateConvert(answer.createdAt) }}</small>
          <br>
          <span class="list-item__subtitle">{{ answer.detail }}</span>
          <br>
        </div>
        <div class="right">
          
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-fab position="bottom right" @click="isCreateAnswer = true">
      <v-ons-icon icon="fa-plus"></v-ons-icon>
    </v-ons-fab>
    <v-ons-fab position='bottom left' @click="backToQuestion">
        <v-ons-icon icon="fa-arrow-left"></v-ons-icon>
    </v-ons-fab>
    <v-ons-dialog cancelable :visible.sync="isCreateAnswer">
      <div class="dialog-container">
        <h4>Create New Answer</h4>
        <v-ons-input placeholder="Detail" style="margin-bottom:5%;" v-model="newAnswerDetail"></v-ons-input>
        <v-ons-button @click="createAnswer">Create</v-ons-button>
      </div>
    </v-ons-dialog>
    </div>

    <v-ons-modal :visible="modalVisible">
      <p style="text-align: center">
        Loading
        <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
      </p>
    </v-ons-modal>
    </v-ons-page>
</template>

<script>
import register from '../pages/RegisterPage'
import {mapState} from 'vuex'

export default {
    data () {
        return {
            id: localStorage.getItem('id'),
            state: 'initial',
            modalVisible: false,
            isCreateShowed: false,
            isCreateAnswer: false,
            isDetailOn: false,
            newAnswerDetail: '',
            newTitle: '',
            newDetail: '',
            selectedQUestion: null
        }
    },
    methods: {
        backToQuestion () {
            this.isDetailOn = false
        },
        dateConvert (date) {
            console.log(date)
            date = new Date(date)
            console.log(date)
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        },
        createAnswer () {
            this.modalVisible = true
            let payload = {
                id: this.selectedQUestion._id,
                answer: { detail: this.newAnswerDetail }
            }
            this.$store.dispatch('createAnswer', payload)
            .then(() => {
                this.modalVisible = false
            })
            .catch(err => {
                this.modalVisible = false
                this.$ons.notification.alert(err.message)
            })
        },
        votingAnswer (voteValue, answer) {
            let checkId = localStorage.getItem('id')
            if (answer.user._id === checkId) {
                this.$ons.notification.alert('Cant vote your own answer')
            } else {
                let alreadyVote = false
                answer.voters.forEach(voterId => {                    
                    if (voterId === checkId) alreadyVote = true
                })
                if (alreadyVote) {
                    this.$ons.notification.alert('You already vote this answer')
                } else {
                    this.modalVisible = true
                    let payload = {
                        id: answer._id,
                        vote: {vote: (answer.vote + voteValue)}
                    }
                    this.$store.dispatch('voteAnswer', payload)
                    .then(() => {
                    this.modalVisible = false
                    })
                    .catch(err => {
                        this.modalVisible = false
                        this.$ons.notification.alert(err.message)
                    })
                }
                
            }
        },
        votingQuestion (voteValue) {
            let checkId = localStorage.getItem('id')
            if (this.selectedQUestion.user._id === checkId) {
                this.$ons.notification.alert('Cant vote your own question')
            } else {
                let alreadyVote = false
                this.selectedQUestion.voters.forEach(voterId => {                    
                    if (voterId === checkId) alreadyVote = true
                })
                if (alreadyVote) {
                    this.$ons.notification.alert('You already vote this question')
                } else {
                    this.modalVisible = true
                    let payload = {
                        id: this.selectedQUestion._id,
                        vote: {vote: (this.selectedQUestion.vote + voteValue)}
                    }
                    this.$store.dispatch('voteQuestion', payload)
                    .then(() => {
                    this.modalVisible = false
                    })
                    .catch(err => {
                        this.modalVisible = false
                        this.$ons.notification.alert(err.message)
                    })
                }
                
            }
        },
        showDetail (question) {            
            this.selectedQUestion = question
            this.isDetailOn = true
        },
        deleteQuestion (question) {
            this.modalVisible = true
            this.$store.dispatch('deleteQuestion', question)
            .then(() => {
                this.modalVisible = false
            })
            .catch(err => {
                this.modalVisible = false
                this.$ons.notification.alert(err.message)
            })

        },
        loadQuestions (done) {
            this.modalVisible = true
            this.$store.dispatch('getAllQuestions')
            .then(() => {
                this.modalVisible = false
                done()
            })
            .catch(err => {
                this.modalVisible = false
                this.$ons.notification.alert(err.message)
                done()
            })
        },
        createQuestion () {
            let question = {
                title: this.newTitle,
                detail: this.newDetail
            }
            
            this.modalVisible = true
            this.newTitle = this.newDetail = ''

            this.$store.dispatch('createQuestion', question)
            .then(() => {
                this.modalVisible = false
                this.$ons.notification.toast('Question is created', {
                    timeout: 1500,
                    animation: 'ascend'
                })
            })
            .catch((err) => {
                this.modalVisible = false
                this.$ons.notification.alert(err.message)
            })
        },
        logOut () {
            localStorage.removeItem('token')
            localStorage.removeItem('id')
            this.$store.commit('changePage', register)
        }
    },
    computed: {
        ...mapState([
            'questions'
        ])
    }
}
</script>

<style>
.dialog-container {
    margin: 10%
}
.thumbs {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.question {
    margin-bottom: 10%;
    background-color: rgba(57, 90, 240, 0.267)
}
</style>
