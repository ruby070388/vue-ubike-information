<template>
  <ul class="pagination">
    <li><a v-show="skipPage !== 0" href="#" @click="skip(-1)">《</a></li>
    <li>
      <a style="margin-left: 5px;"
         href="#"
         v-for="page in 10 > total ? total : 10"
         :key="page"
         @click="selectPage(page)">{{ page + (skipPage * 10) }}</a>
    </li>
    <li><a href="#" @click="skip(1)" v-show="((skipPage + 1) * 10) < total">》</a></li>
  </ul>
</template>

<script>
export default {
  name: 'Search',
  props: {
    skipPage: Number,
    total: Number,
  },
  methods: {
    selectPage(page) {
      //傳送母元件
      this.$emit('receivePage', page + (this.skipPage * 10));
    },
    skip(count) {
      //傳送母元件
      this.$emit('receiveSkip', count);
    },
  }
}
</script>
