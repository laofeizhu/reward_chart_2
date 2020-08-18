<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
      <v-container>
        <v-row justify="start">
          <v-col
            v-for="score in scores"
            :key="score.id"
            cols="3"
            sm="3"
            xs="4"
            @click="confirmDeleteScoreDialog(score.id)"
          >
            <v-img :src="score.avatarUrl"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-list-item-content>

    <v-list-item-icon>
      <v-icon @click="addScoreDialogWithDateOffset(dateOffset)">mdi-plus-thick</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  props: {
    title: String,
    scores: Array,
    confirmDeleteScoreDialog: Function,
    dateOffset: Number,
    addScoreDialogWithDateOffset: Function,
  },
}
</script>