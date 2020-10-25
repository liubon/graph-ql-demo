<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>{{ hello }}</div>
    <div v-if="$apollo.loading">Loading...</div>
    <h3>Ping</h3>
    <p>
      {{ ping }}
    </p>
    <input v-model="pingInput" placeholder="Enter a message" />
    <button @click="addTag">addTag</button>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "HelloWorld",
  apollo: {
    hello: gql`
      query {
        hello
      }
    `,
    tags:gql`
      query {
        tags {id,label}
      }
    `,
    // 带参数的查询
    ping: {
      query: gql`
        query PingMessage($message: String!) {
          ping(message: $message)
        }
      `,
      // 响应式参数
      variables() {
        // 在这里使用 vue 响应式属性
        return {
          message: this.pingInput,
        };
      },
    },
  },
  props: {
    msg: String,
  },
  data() {
    return {
      ping: "",
      pingInput: "",
      newTag: 'asdasda',
    };
  },
  methods: {
    async addTag() {
      // 保存用户输入以防止错误
      const newTag = this.newTag;
      // 将其清除以尽早更新用户页面
      // this.newTag = "";
      // 调用 graphql 变更
      this.$apollo
        .mutate({
          // 查询语句
          mutation: gql`
            mutation($label: String!) {
              addTag(label: $label) {
                id
                label
              }
            }
          `,
          // 参数
          variables: {
            label: newTag,
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          // update: (store, { data: { addTag } }) => {
          //   // 从缓存中读取这个查询的数据
          //   const data = store.readQuery({ query: TAGS_QUERY });
          //   // 将变更中的标签添加到最后
          //   data.tags.push(addTag);
          //   // 将数据写回缓存
          //   store.writeQuery({ query: TAGS_QUERY, data });
          // },
          // 乐观 UI
          // 将在请求产生时作为“假”结果，使用户界面能够快速更新
          // optimisticResponse: {
          //   __typename: "Mutation",
          //   addTag: {
          //     __typename: "Tag",
          //     id: -1,
          //     label: newTag,
          //   }
          // }
        })
        .then((data) => {
          // 结果
          console.log(data);
        })
        .catch((error) => {
          // 错误
          console.error(error);
          // 恢复初始用户输入
          this.newTag = newTag;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
