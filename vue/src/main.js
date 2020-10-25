import Vue from 'vue'
import App from './App.vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
const apolloClient = new ApolloClient({
  // 你需要在这里使用绝对路径
  uri: 'http://localhost:4000/graphql'
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  apolloProvider,
}).$mount('#app')
