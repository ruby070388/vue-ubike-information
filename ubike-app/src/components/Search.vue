<template>
  <p>
    站點名稱搜尋: <input type="text" v-model="searchChildName" @keyup="setName(searchChildName)">&nbsp;&nbsp;
    <button @click="reset">重置</button>
  </p>
</template>

<script>
export default {
  name: 'Search',
  props: {
    searchName: String
  },
  data () {
    return {
      searchChildName: this.searchName
    }
  },
  methods: {
    reset () {
      //傳送母元件
      this.$emit('receiveReset');
    },
    setName(val) {
      console.log(val)
      //傳送母元件
      this.$emit('receiveName', val);
    }
  },
}
</script>
