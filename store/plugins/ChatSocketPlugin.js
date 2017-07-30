import * as types from '../../mutation-types.js'

export default function createChatSocketPlugin (socket) {
  return store => {
    /*  window.socket.on('refresh message', function (message) {
      if (message.conversationId === store.state.conversations.currentConversationId) {
        store.state.conversations.currentConversation.push(message)
      }
      store.dispatch('conversations/fetchConversations')
    })
    // else updated snippet whenver new message
    window.socket.on('new message', function (data) {
      store.dispatch('conversations/fetchConversations')
    }) */
    store.subscribe((mutation, state) => {
      console.log(mutation.type)
      // automatically subcirbe all conversation of authenticated user
      if (mutation.type === 'conversations/' + types.RECEIVE_CONVERSATIONS) {
        state.conversations.conversations.forEach(function (conv) {
          socket.emit('enter conversation', {conversationId: conv.conversationId})
        })
      }
      // update chat snippet of the left side whenever conversation change
      if (mutation.type === 'conversations/' + types.PUSH_NEW_MSG_IN_CUR_CONVERSATION ||
          mutation.type === 'conversations/' + types.PUSH_NEW_CONVERSATION ||
          mutation.type === 'conversations/' + types.DELETE_CONVERSATION) {
        store.dispatch('conversations/fetchConversations')
        if (mutation.type === 'conversations/' + types.PUSH_NEW_MSG_IN_CUR_CONVERSATION ||
            mutation.type === 'conversations/' + types.PUSH_NEW_CONVERSATION) {
          let message = mutation.payload
          let data = {conversationId: mutation.payload.conversationId, message: message}
          socket.emit('new message', data)
        }
      }
    })
  }
}
