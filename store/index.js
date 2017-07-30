import Vuex from 'vuex'
import conversations from './modules/conversations.js'
import { default as createChatSocketPlugin } from './plugins/ChatSocketPlugin.js'
import socket from '~plugins/socket'

const ChatSocketPlugin = createChatSocketPlugin(socket)

const store = () => new Vuex.Store({
  modules: {
    conversations
  },
  plugins: [ChatSocketPlugin]
})

export default store
