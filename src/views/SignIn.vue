<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 offset-sm2 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm8 offset-sm2 mt-3>
        <form @submit.prevent>
          <v-layout column>
            <v-flex>
              <v-text-field
                v-model.trim="signinForm.email"
                name="email"
                label="Email"
                id="email"
                type="email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model.trim="signinForm.password"
                name="password"
                label="Password"
                id="password"
                type="password"
                required
              ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" @click="signin()">Sign In</v-btn>
              <v-btn text color="primary" to="/signup">Sign Up</v-btn>
              <v-btn text color="primary">Reset Password</v-btn>
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
      signinForm: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signin() {
      this.$store.dispatch("signin", this.signinForm);
    },
  },
};
</script>
