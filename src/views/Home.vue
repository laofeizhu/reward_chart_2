<template>
  <v-row justify="center">
    <v-col cols="12" sm="4" md="2">
      <v-card class="mx-auto" max-width="344">
      <v-list-item>
        <v-avatar class="ma-3" size="125" tile>
          <v-img :src="currentKid.avatarUrl"></v-img>
        </v-avatar>
      </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-menu bottom origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">{{ currentKid.name }}</v-btn>
              </template>
              <v-list>
                <v-list-item v-for="kid in kids" :key="kid.id" @click="setCurrentKidById(kid.id)">
                  <v-list-item-title>{{ kid.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-title>
          <v-spacer></v-spacer>
          <v-list-item-subtitle class="text-right">
            <v-icon>mdi-star</v-icon>
            {{ currentKid.balance}}
          </v-list-item-subtitle>
        </v-list-item>
        <div v-for="reward in rewardsForCurrentKid" :key="reward.id">
          <v-list-item>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="reward.avatarUrl"></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <v-progress-linear
              v-if="currentKid.balance < reward.price"
              :value="Math.floor(currentKid.balance * 100 / reward.price)"
              height="25"
              rounded
            >
              <strong>{{ `${currentKid.balance}/${reward.price}` }}</strong>
            </v-progress-linear>
            <v-btn
              v-else
              rounded
              color="primary"
              dark
              @click="confirmRedeemRewardDialog(reward)"
            >Redeem reward</v-btn>
          </v-list-item>
        </div>
      </v-card>
    </v-col>
    <v-dialog v-model="deleteScoreDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Delete Score?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteScore()">Delete</v-btn>
          <v-btn color="green darken-1" text @click="deleteScoreDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="redeemRewardDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Redeem this reward?</v-card-title>
        <v-img v-if="rewardToRedeem" :src="rewardToRedeem.avatarUrl"></v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="redeemReward()">Redeem</v-btn>
          <v-btn color="green darken-1" text @click="redeemRewardDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addScoreDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Add a star</v-card-title>
        <v-container>
          <v-row justify="start">
            <v-col v-for="badge in badges" :key="badge.id" cols="3" @click="addScore(badge)">
              <v-img :src="badge.avatarUrl"></v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="addScoreDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-toolbar color="primary lighten-1" dark>
          <v-icon>mdi-star</v-icon>
          <v-toolbar-title>Star Board</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <StarRow
            :scores="scores | scoresWithOffset(0, 0)"
            :dateOffset="0"
            :title="'Today'"
            :addScoreDialogWithDateOffset="addScoreDialogWithDateOffset"
            :confirmDeleteScoreDialog="confirmDeleteScoreDialog"
          ></StarRow>
          <v-divider></v-divider>
          <StarRow
            :scores="scores | scoresWithOffset(-1, -1)"
            :dateOffset="-1"
            :title="'Yesterday'"
            :addScoreDialogWithDateOffset="addScoreDialogWithDateOffset"
            :confirmDeleteScoreDialog="confirmDeleteScoreDialog"
          ></StarRow>
          <v-divider></v-divider>
          <StarRow
            :scores="scores | scoresWithOffset(-6, -2)"
            :dateOffset="-2"
            :title="'Last Week'"
            :addScoreDialogWithDateOffset="addScoreDialogWithDateOffset"
            :confirmDeleteScoreDialog="confirmDeleteScoreDialog"
          ></StarRow>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import StarRow from "@/components/StarRow.vue";
import moment from "moment";

export default {
  components: {
    StarRow,
  },
  data() {
    return {
      addScoreDialog: false,
      deleteScoreDialog: false,
      redeemRewardDialog: false,
      scoreIdToDelete: null,
      rewardToRedeem: null,
      scoredOnDateOffset: 0,
    };
  },
  computed: {
    ...mapState(["kids", "badges", "currentKid", "scores", "rewards"]),
    rewardsForCurrentKid() {
      let result = []
      let earnedRewards = new Set(this.currentKid.rewards)
      this.rewards.forEach(reward => {
        if (!earnedRewards.has(reward.id)) {
          result.push(reward)
        }
      })
      return result
    },
  },
  methods: {
    addScoreDialogWithDateOffset(dateOffset) {
      this.scoredOnDateOffset = dateOffset;
      this.addScoreDialog = true;
    },
    addScore(badge) {
      let date = new Date();
      date.setDate(date.getDate() + this.scoredOnDateOffset);
      let score = {
        kidId: this.currentKid.id,
        avatarUrl: badge.avatarUrl,
        scoredOn: date,
      };
      this.$store.dispatch("addScore", score);
      this.addScoreDialog = false;
    },
    confirmDeleteScoreDialog(scoreId) {
      this.scoreIdToDelete = scoreId;
      this.deleteScoreDialog = true;
    },
    confirmRedeemRewardDialog(reward) {
      this.redeemRewardDialog = true;
      this.rewardToRedeem = reward;
    },
    redeemReward() {
      this.$store.dispatch("redeemReward", this.rewardToRedeem);
      this.redeemRewardDialog = false;
    },
    deleteScore() {
      this.$store.dispatch("deleteScore", this.scoreIdToDelete);
      this.deleteScoreDialog = false;
    },
    setCurrentKidById(id) {
      this.$store.dispatch("fetchCurrentKidById", id);
    },
  },
  filters: {
    scoresWithOffset(scores, fromDateOffset, toDateOffset) {
      let from = moment().add(fromDateOffset, "days").startOf("day");
      let to = moment().add(toDateOffset, "days").endOf("day");
      return scores.filter(
        (score) =>
          moment(score.scoredOn.toDate()).isBefore(to) &&
          moment(score.scoredOn.toDate()).isAfter(from)
      );
    },
  },
};
</script>