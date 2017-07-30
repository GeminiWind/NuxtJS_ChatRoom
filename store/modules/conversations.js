import * as types from '../../mutation-types.js'
import swal from '~plugins/swal'
import axios from '~plugins/axios'

export default {
  namespaced: true,
  state: {
    conversations: [],
    currentConversation: [],
    currentConversationId: ''
  },
  getters: {
    allConversation: state => state.conversations,
    currentConversation: state => state.currentConversation,
    currentConversationId: state => state.currentConversationId
  },
  mutations: {
    [types.RECEIVE_CONVERSATIONS] (state, conversations) {
      state.conversations = conversations
    },
    [types.RECEIVE_CONVERSATION_CONTENT] (state, currentConversation) {
      state.currentConversation = currentConversation
    },
    [types.SET_CUR_CONVERSATION_ID] (state, currentConversationId) {
      state.currentConversationId = currentConversationId
    },
    [types.DELETE_CONVERSATION] (state, {conversationIndex}) {
      state.conversations.splice(conversationIndex, 1)
    },
    [types.PUSH_NEW_CONVERSATION] (state, conversation) {
      state.conversations.push(conversation)
    },
    [types.PUSH_NEW_MSG_IN_CUR_CONVERSATION] (state, message) {
      state.currentConversation.push(message)
    }
  },
  actions: {
    fetchConversations ({ commit }) {
      axios.get('/api/messages').then(response => {
        commit(types.RECEIVE_CONVERSATIONS, response.data.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    fetchConversationContent ({ commit }, conversationId) {
      axios.get('/api/messages/' + conversationId).then(response => {
        commit(types.RECEIVE_CONVERSATION_CONTENT, response.data.data)
        commit(types.SET_CUR_CONVERSATION_ID, conversationId)
      }).catch(function (error) {
        console.log(error)
      })
    },
    replyConversation ({ commit }, payload) {
      axios.post('/api/messages/' + payload.conversationId, {message: payload.message}).then(response => {
        commit(types.PUSH_NEW_MSG_IN_CUR_CONVERSATION, response.data.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    replyConversationImage ({ commit }, payload) {
      let config = { headers: { 'Content-Type': 'multipart/form-data' } }
      axios.post('/api/messages/' + payload.conversationId, payload.data, config).then(response => {
        commit(types.PUSH_NEW_MSG_IN_CUR_CONVERSATION, response.data.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    deleteConversation ({ commit, state }, payload) {
      axios.delete('/api/messages/' + payload.conversationId).then(response => {
        let conversationIndex = state.conversations.findIndex(function (conv) {
          return conv.conversationId === payload.conversationId
        })
        commit(types.DELETE_CONVERSATION, conversationIndex)
        swal({
          title: 'Success!',
          text: 'Your conversation was deleted.',
          timer: 1000,
          type: 'success'
        })
      }).catch(function (error) {
        console.log(error)
      })
    },
    createConversation ({ commit, state }, payload) {
      axios.post('/api/messages/new/' + payload.receiver._id, {message: payload.body}).then(response => {
        state.conversations.forEach(function (conv) {
          // conversation is exist
          if (conv.conversationId === response.data.data.conversationId) {
            if (state.currentConversationId === response.data.data.conversationId) {
              commit(types.PUSH_NEW_MSG_IN_CUR_CONVERSATION, response.data.data)
            }
          } else {
            // not exist
            commit(types.PUSH_NEW_CONVERSATION, response.data.data)
          }
        })
        swal({
          title: 'Success!',
          text: 'Your message was sent.',
          timer: 1000,
          type: 'success'
        })
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
