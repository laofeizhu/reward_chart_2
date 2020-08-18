<template>
  <div>
    <v-navigation-drawer v-model="sidebar" app class="hidden-sm-and-up">
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
        <v-list-item @click="signout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Sign Out</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary">
      <span class="hidden-sm-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
      </span>
      <v-toolbar-title>{{appTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text rounded v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn text rounded @click="signout()">
          <v-icon>mdi-logout</v-icon>
          Log Out
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      appTitle: "Star",
      sidebar: false,
      menuItems: [
        {
          title: "Home",
          path: "/home",
          icon: "mdi-home",
        },
        {
          title: "Kids",
          path: "/kids",
          icon: "mdi-baby-face-outline",
        },
        {
          title: "Badges",
          path: "/badges",
          icon: "mdi-shield-star",
        },
        {
          title: "Rewards",
          path: "/rewards",
          icon: "mdi-gift",
        },
      ],
    };
  },
  methods: {
    signout() {
      this.$store.dispatch("signout");
    },
  },
};
</script>