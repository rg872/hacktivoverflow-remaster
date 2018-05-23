<template>
  <div>
  <h4>Register</h4>
  <v-ons-list>
    <v-ons-list-item>
      <div class="center">
        <v-ons-input type="email" placeholder="Input your email" float v-model="email">        
        </v-ons-input>
        <small v-show="invalidEmail" style="color: red;">Email is not valid</small>
      </div>
    </v-ons-list-item>
    <v-ons-list-item>
      <v-ons-input type="password" placeholder="Input your password" float v-model="password">      
      </v-ons-input>
      <small v-show="invalidPassword" style="color: red;">Password must be more than 6 character</small>
    </v-ons-list-item>
    <v-ons-list-item>
      <v-ons-input type="password" placeholder="Input your password again" float v-model="passwordConfirm">        
      </v-ons-input>
      <small v-show="invalidConfirmation" style="color: red;">Password is not same</small>
    </v-ons-list-item>
    <v-ons-list-item>
     <v-ons-button modifier="large" @click="signUp">Submit</v-ons-button>
    </v-ons-list-item>
  </v-ons-list>
  <v-ons-modal :visible="modalVisible">
      <p style="text-align: center">
        Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
      </p>
  </v-ons-modal>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import home from '../pages/HomePage'

export default {
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      invalidEmail: false,
      invalidConfirmation: false,
      invalidPassword: false,
      modalVisible: false
    }
  },
  methods: {
    signUp () {
      if (!this.invalidEmail && !this.invalidConfirmation && !this.invalidPassword) {
        this.modalVisible = true
        let user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('signUp', user)
          .then((role) => {
            this.modalVisible = false            
            this.$store.commit('nextPage', home)            
          })
          .catch((err) => {
            this.modalVisible = false
            this.$ons.notification.alert(err.message)
          })
      } else {
        this.$ons.notification.alert('Email/password is invalid')
      }
    }
  },
  watch: {
    email () {
       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       let check = re.test(String(this.email).toLowerCase());
      (check) ? this.invalidEmail = false : this.invalidEmail = true
    },
    password () {
      (this.password.length > 6) ? this.invalidPassword = false : this.invalidPassword = true
    },
    passwordConfirm () {
      (this.passwordConfirm === this.password) ? this.invalidConfirmation = false : this.invalidConfirmation = true
    }
  }
}
</script>

<style>

</style>
