  <template>
  <v-container fluid>
    <v-col v-for="(reward, i) in rewards" :key="i" cols="12">
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-card light>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="reward.name"></v-card-title>
              <v-card-subtitle>
                <v-icon>mdi-star</v-icon>
                {{ reward.price }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" @click="deleteReward(reward.id)">Remove</v-btn>
              </v-card-actions>
            </div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="reward.avatarUrl"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-flex>
    </v-col>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">Add a reward</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Reward</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model.trim="addRewardForm.name" label="Name*" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model.trim="addRewardForm.price"
                    type="number"
                    label="Price"
                    required
                  ></v-text-field>
                </v-col>
                <v-file-input
                  v-model="addRewardForm.photoFile"
                  prepend-icon="mdi-camera"
                  label="Photo"
                ></v-file-input>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="addReward()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    dialog: false,
    addRewardForm: {
      name: "",
      price: 8,
      photoFile: null,
    },
  }),
  methods: {
    addReward() {
      this.dialog = false;
      this.$store.dispatch("addReward", this.addRewardForm);
    },
    deleteReward(rewardId) {
      this.$store.dispatch("deleteReward", rewardId);
    },
  },
  computed: {
    ...mapState(["rewards"]),
  },
};
</script>