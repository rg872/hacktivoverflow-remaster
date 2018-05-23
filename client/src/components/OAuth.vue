<template>
    <div>
        <h4>Oauth</h4>
        <v-ons-list>
            <v-ons-list-item>
                <div id="firebaseui-auth-container"></div>
                <div id="loader">Loading...</div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-modal :visible="modalVisible">
      <p style="text-align: center">
        Loading
        <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
      </p>
    </v-ons-modal>
    </div>
</template>

<script>
import '../firebase.js'
import firebase from 'firebase'
import firebaseui from 'firebaseui'

import home from '../pages/HomePage' 

export default {
    data () {
        return {
            modalVisible: false
        }
    },
    created () {
        let self = this
        const ui = new firebaseui.auth.AuthUI(firebase.auth())

        const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                self.modalVisible = true
                self.$store.dispatch('oAuth', authResult.user.email)
                .then(() => {
                    self.modalVisible = false
                    self.$store.commit('changePage', home)   
                })
                .catch((err) => {
                    self.modalVisible = false
                    self.$ons.notification.alert(err.message)
                })
                
                
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none'
            }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            //signInSuccessUrl: '<url-to-redirect-to-on-success>',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    scopes: [
                        //'https://www.googleapis.com/auth/plus.login'
                        'email'
                    ],
                    customParameters: {
                        // Forces account selection even when one account
                        // is available.
                        prompt: 'select_account'
                    }
                    },
                    {
                    provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    scopes: [
                        //'public_profile',                        
                        // 'user_likes',
                        // 'user_friends'
                        'email'
                    ],
                    customParameters: {
                        // Forces password re-entry.
                        auth_type: 'reauthenticate'
                    }
                    },
            ],
            // Terms of service url.
            //tosUrl: '<your-tos-url>'
            }

        ui.start('#firebaseui-auth-container', uiConfig)

    }

}
</script>

<style>

</style>
