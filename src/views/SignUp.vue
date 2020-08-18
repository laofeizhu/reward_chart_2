<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 offset-sm2 class="text-xs-center" mt-5>
        <h1>Sign Up</h1>
      </v-flex>
      <v-flex xs12 sm8 offset-sm2 mt-3>
        <form @submit.prevent>
          <v-layout column>
            <v-flex>
              <v-text-field
                v-model.trim="signupForm.name"
                name="name"
                label="Name"
                id="name"
                type="text"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model.trim="signupForm.email"
                name="email"
                label="Email"
                id="email"
                type="email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model.trim="signupForm.password"
                name="password"
                label="Password"
                id="password"
                type="password"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                required
              ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" @click="signup()">Sign Up</v-btn>
              <v-btn text color="primary" to="/signin">Sign In</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      signupForm: {
        name: '',
        email: '',
        password: '',
      },
      showLoginForm: true,
      showPasswordReset: false
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', this.signupForm)
    }
  }
}
</script>
