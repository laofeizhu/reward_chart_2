<template>
  <div id="app">
    <v-app>
      <Navbar v-if="isSignedIn" />
      <!-- Sizes your content based upon application components -->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Navbar from "@/components/layout/Navbar.vue"

export default {
  props: {
    source: String,
  },
  components: {
    Navbar,
  },
  computed: {
    ...mapState(["userProfile"]),
    isSignedIn() {
      if (!this.userProfile) return false
      return Object.keys(this.userProfile).length >= 1
    },
  }
}
</script>ß