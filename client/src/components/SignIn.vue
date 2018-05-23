<template>
  <div>
  <h4>Log In</h4>   
  <v-ons-list>
    <v-ons-list-item>
      <div class="center">
        <v-ons-input type="email" placeholder="Input your email" float v-model="email">
        </v-ons-input>
      </div>
    </v-ons-list-item>
    <v-ons-list-item>
      <v-ons-input type="password" placeholder="Input your password" float v-model="password">
      </v-ons-input>
    </v-ons-list-item>    
    <v-ons-list-item>
     <v-ons-button modifier="large" @click="signIn">Submit</v-ons-button>
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
      modalVisible: false
    }
  },
  methods: {
    signIn () {
      this.modalVisible = true
      this.$store.dispatch('signIn', {email: this.email, password: this.password})
      .then((role) => {        
        this.modalVisible = false
        this.$store.commit('nextPage', home)
      })
      .catch((err) => {
        this.modalVisible = false
        this.$ons.notification.alert(err.message)
      })
      
    }
  }
}
</script>

<style>

</style>
