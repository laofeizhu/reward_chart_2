import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import router from '../router/index'

Vue.use(Vuex)

// helpers
const getItemsFromDocRefs = (docs) => {
  let items = []
  docs.forEach(doc => {
    let item = doc.data()
    item.id = doc.id
    items.push(item)
  })
  return items
}

const store = new Vuex.Store({
  state: {
    userProfile: {},
    currentKid: {},
    kids: [],
    badges: [],
    rewards: [],
    scores: [],
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setKids(state, val) {
      state.kids = val
    },
    setBadges(state, val) {
      state.badges = val
    },
    setRewards(state, val) {
      state.rewards = val
    },
    setCurrentKid(state, val) {
      state.currentKid = val
    },
    setScores(state, val) {
      state.scores = val
    }
  },
  actions: {
    async autoSignIn({ dispatch }) {
      dispatch('fetchAllItems')
    },
    async signin({ dispatch }, form) {
      // sign user in
      await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      // fetch user profile and set in state
      dispatch('fetchAllItems')
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        kids: [],
        badges: [],
        rewards: [],
      })

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchAllItems({ dispatch }) {
      dispatch('fetchUserProfile')
      dispatch('fetchKids')
      dispatch('fetchBadges')
      dispatch('fetchRewards')
    },
    async fetchKids({ dispatch, commit, getters }) {
      const docs = await fb.kidsCollection.where("userId", "==", fb.auth.currentUser.uid).get()
      let kids = getItemsFromDocRefs(docs)
      if (Object.keys(getters.getCurrentKid).length == 0 && kids.length) {
        dispatch('fetchCurrentKidById', kids[0].id)
      }
      commit('setKids', kids)
    },
    async fetchCurrentKidById({ commit, dispatch }, kidId) {
      const kid = await fb.kidsCollection.doc(kidId).get()
      let currentKid = kid.data()
      currentKid.id = kid.id
      commit('setCurrentKid', currentKid)
      dispatch('fetchScores')
    },
    async fetchBadges({ commit }) {
      const docs = await fb.badgesCollection.where("userId", "==", fb.auth.currentUser.uid).get()
      let badges = getItemsFromDocRefs(docs)
      const defaultBadges = [
        {
          name: "Star",
          avatarUrl: `${process.env.BASE_URL}badges/juststar.png`,
          id: "default-star",
        },
        {
          name: "Study",
          avatarUrl: `${process.env.BASE_URL}badges/study.png`,
          id: "default-study",
        },
        {
          name: "Brush Teeth",
          avatarUrl: `${process.env.BASE_URL}badges/brushteeth.png`,
          id: "default-brush-teeth",
        },
        {
          name: "Sharing",
          avatarUrl: `${process.env.BASE_URL}badges/sharing.png`,
          id: "default-sharing",
        },
        {
          name: "Sleep",
          avatarUrl: `${process.env.BASE_URL}badges/sleep.png`,
          id: "default-sleep",
        },
      ]
      defaultBadges.forEach(badge => {
        badge.isDefault = true
        badge.isActive = true
      })
      badges.push(...defaultBadges)
      commit('setBadges', badges)
    },
    async fetchRewards({ commit }) {
      const docs = await fb.rewardsCollection.where("userId", "==", fb.auth.currentUser.uid).get()
      let rewards = getItemsFromDocRefs(docs)
      commit('setRewards', rewards)
    },
    async fetchScores({ commit, state }) {
      // TODO: try sort from database
      const docs = await fb.scoresCollection.where("kidId", "==", state.currentKid.id).get()
      let scores = getItemsFromDocRefs(docs)
      scores.sort((a,b) => a.scoredOn.seconds - b.scoredOn.seconds)
      commit('setScores', scores)
    },
    async fetchUserProfile({ commit }) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(fb.auth.currentUser.uid).get()
      // set user profile in state
      commit('setUserProfile', userProfile.data())
      // change route to dashboard
      if (router.currentRoute.path === '/signin') {
        router.push('/home')
      }
      if (router.currentRoute.path === '/signup') {
        router.push('/kids')
      }
    },
    clearState({ commit }) {
      commit('setUserProfile', {})
      commit('setCurrentKid', {})
      commit('setKids', [])
      commit('setBadges', [])
      commit('setRewards', [])
      commit('setScores', [])
    },
    async signout({ dispatch }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      dispatch('clearState')

      // redirect to login view
      router.push('/signin')
    },
    async uploadImage(_, { file, updateUrlCb }) {
      const storageRef = firebase.storage().ref(file.name + Date.now()).put(file)
      storageRef.on('state_changed', () => { }, error => { console.log(error.message) },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then(updateUrlCb)
        }
      )
    },
    async addBadge({ dispatch }, addBadgeForm) {
      const userId = fb.auth.currentUser.uid
      const badgeRef = await fb.badgesCollection.add({
        name: addBadgeForm.name,
        userId: userId,
        avatarUrl: "",
        isActive: true,
        isDefault: false,
      })
      let updateUrlCb = (url) => {
        badgeRef.update({
          avatarUrl: url,
        }).then(() => {
          dispatch('fetchBadges')
        })
      }
      dispatch('uploadImage', { file: addBadgeForm.photoFile, updateUrlCb })

      // update user object
      await fb.usersCollection.doc(userId).update({
        badges: firebase.firestore.FieldValue.arrayUnion(badgeRef.id)
      })
      dispatch('fetchUserProfile')
    },
    async addReward({ dispatch }, addRewardForm) {
      const userId = fb.auth.currentUser.uid
      const rewardRef = await fb.rewardsCollection.add({
        name: addRewardForm.name,
        userId: userId,
        avatarUrl: "",
        price: addRewardForm.price,
      })
      let updateUrlCb = (url) => {
        rewardRef.update({
          avatarUrl: url,
        })
        dispatch('fetchRewards')
      }
      dispatch('uploadImage', { file: addRewardForm.photoFile, updateUrlCb })

      // update user object
      await fb.usersCollection.doc(userId).update({
        rewards: firebase.firestore.FieldValue.arrayUnion(rewardRef.id)
      })
      dispatch('fetchUserProfile')
    },
    async addScore({ dispatch }, score) {
      let scoreRef = await fb.scoresCollection.add(score)
      // update kid
      await fb.kidsCollection.doc(score.kidId).update({
        scores: firebase.firestore.FieldValue.arrayUnion(scoreRef.id),
        balance: firebase.firestore.FieldValue.increment(1),
      })
      dispatch('fetchCurrentKidById', score.kidId)
      dispatch('fetchKids')
    },
    async addKid({ dispatch }, addKidForm) {
      const userId = fb.auth.currentUser.uid
      const kidRef = await fb.kidsCollection.add({
        name: addKidForm.name,
        userId: userId,
        avatarUrl: "",
        scores: [],
        rewards: [],
        balance: addKidForm.balance,
      })
      let updateUrlCb = (url) => {
        kidRef.update({
          avatarUrl: url,
        })
        dispatch('fetchKids')
      }
      dispatch('uploadImage', { file: addKidForm.photoFile, updateUrlCb })

      // update user object
      await fb.usersCollection.doc(userId).update({
        kids: firebase.firestore.FieldValue.arrayUnion(kidRef.id)
      })
      dispatch('fetchUserProfile')
    },
    async deleteBadge({ dispatch }, badgeId) {
      fb.badgesCollection.doc(badgeId).delete().then(() => {
        fb.usersCollection.doc(fb.auth.currentUser.uid).update({
          badges: firebase.firestore.FieldValue.arrayRemove(badgeId)
        }).then(() => {
          dispatch('fetchUserProfile')
          dispatch('fetchBadges')
        })
      }).catch(error => {
        console.log("Error removing badge: ", error)
      })
    },
    async deleteReward({ dispatch }, rewardId) {
      fb.rewardsCollection.doc(rewardId).delete().then(() => {
        fb.usersCollection.doc(fb.auth.currentUser.uid).update({
          rewards: firebase.firestore.FieldValue.arrayRemove(rewardId)
        }).then(() => {
          dispatch('fetchUserProfile')
          dispatch('fetchRewards')
        })
      }).catch(error => {
        console.log("Error removing reward: ", error)
      })
    },
    async deleteScore({ dispatch }, scoreId) {
      let scoreRef = await fb.scoresCollection.doc(scoreId).get()
      let kidId = scoreRef.data().kidId

      fb.scoresCollection.doc(scoreId).delete().then(() => {
        fb.kidsCollection.doc(kidId).update({
          scores: firebase.firestore.FieldValue.arrayRemove(scoreId),
          balance: firebase.firestore.FieldValue.increment(-1),
        }).then(() => {
          dispatch('fetchCurrentKidById', kidId)
          dispatch('fetchKids')
        })
      }).catch(error => {
        console.log("Error removing score: ", error)
      })
    },
    async deleteKid({ dispatch, getters }, kidId) {
      let kidRef = await fb.kidsCollection.doc(kidId).get()
      let scores = kidRef.data().scores
      scores.forEach(score => {
        fb.scoresCollection.doc(score).delete()
      })
      fb.kidsCollection.doc(kidId).delete().then(() => {
        fb.usersCollection.doc(fb.auth.currentUser.uid).update({
          kids: firebase.firestore.FieldValue.arrayRemove(kidId)
        }).then(() => {
          if (kidId === getters.getCurrentKid.id) {
            this.commit('setCurrentKid', {})
          }
          dispatch('fetchUserProfile')
          dispatch('fetchKids')
        })
      }).catch(error => {
        console.log("Error removing kid: ", error)
      })
    },
    async redeemReward({ dispatch, getters }, rewardToRedeem) {
      let currentKid = getters.getCurrentKid
      fb.kidsCollection.doc(currentKid.id).update({
        balance: firebase.firestore.FieldValue.increment(-rewardToRedeem.price),
        rewards: firebase.firestore.FieldValue.arrayUnion(rewardToRedeem.id),
      }).then(() => {
        dispatch('fetchKids')
        dispatch('fetchCurrentKidById', currentKid.id)
      })

    },
    async likePost(foo, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`

      // check if user has liked post
      const doc = await fb.rewardsCollection.doc(docId).get()
      if (doc.exists) { return }

      // create post
      await fb.rewardsCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })

      // update post rewards count
      fb.kidsCollection.doc(post.id).update({
        rewards: post.rewardsCount + 1
      })
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid
      // update user object
      await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title
      })

      dispatch('fetchUserProfile')

      // update all kids by user
      const postDocs = await fb.kidsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.kidsCollection.doc(doc.id).update({
          userName: user.name
        })
      })

      // update all badges by user
      const commentDocs = await fb.badgesCollection.where('userId', '==', userId).get()
      commentDocs.forEach(doc => {
        fb.badgesCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    }
  },
  getters: {
    getCurrentKid (state) {
      return state.currentKid
    },
    getKids(state) {
      return state.kids
    },
  },
})

export default store