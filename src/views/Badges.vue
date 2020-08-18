  <template>
  <v-container fluid>
    <v-col v-for="(badge, i) in badges" :key="i" cols="12">
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-card light>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="badge.name"></v-card-title>
              <v-card-actions v-if="!badge.isDefault">
                <v-btn text color="deep-purple accent-4" @click="deleteBadge(badge.id)">Remove</v-btn>
              </v-card-actions>
            </div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="badge.avatarUrl"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-flex>
    </v-col>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">Add a badge</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Badge</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.trim="addBadgeForm.name" label="Name*" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-file-input
                  v-model="addBadgeForm.photoFile"
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
            <v-btn color="blue darken-1" text @click="addBadge()">Save</v-btn>
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
    addBadgeForm: {
      name: "",
      photoFile: null,
    },
  }),
  methods: {
    addBadge() {
      this.dialog = false;
      this.$store.dispatch("addBadge", this.addBadgeForm);
    },
    deleteBadge(badgeId) {
      this.$store.dispatch("deleteBadge", badgeId)
    }
  },
  computed: {
    ...mapState(["badges"]),
  },
};
</script>