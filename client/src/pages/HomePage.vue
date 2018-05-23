<template>
  <v-ons-page>
    <v-ons-splitter>
      <v-ons-splitter-side swipeable collapse width="250px" :animation="$ons.platform.isAndroid() ? 'overlay' : 'reveal'" :open.sync="menuIsOpen">
        <v-ons-page>
          <v-ons-card>
            <img src="http://live.hacktiv8.com/img/logo/hacktiv8.png" style="width: 100%">            
            <div class="title">
              Hacktiv Overflow
            </div>
          </v-ons-card>
          <v-ons-list>
            <v-ons-list-item v-for="(page, index) in pages" :key="index" tappable modifier="chevron" @click="currentPage = page">
              <div class="center">{{ pageDescription(page) }}</div>
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-page>
      </v-ons-splitter-side>
      <v-ons-splitter-content>
        <component :is="currentPage"></component>
      </v-ons-splitter-content>
    </v-ons-splitter>
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
import question from '../components/Questions'

export default {
  components: {
    question
  },
  data () {
    return {
      currentPage: 'question',
      pages: ['question'],
      modalVisible: false
    }
  },
  methods: {
    pageDescription (page) {
      switch (page) {
        case 'question' :
          return 'Questions'
      }
    }
  },
  computed: {
    menuIsOpen: {
      get () {
        return this.$store.state.isMenuOpen
      },
      set () {
        this.$store.commit('menuOpen')
      }
    }
  },
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$store.commit('changePage', register)      
    } else {
      this.modalVisible = true
      this.$store.dispatch('getAllQuestions')
      .then(() => {
        this.modalVisible = false
      })
      .catch(err => {
        this.modalVisible = false
        this.$ons.notification.alert(err.message)
      })
    }
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
