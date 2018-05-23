<template>
  <v-ons-page id="app">
    <v-ons-navigator swipeable
    :page-stack="pageStack"
  ></v-ons-navigator>
  </v-ons-page>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState([
      'pageStack'
    ])
  }
}
</script>

<style>

</style>
