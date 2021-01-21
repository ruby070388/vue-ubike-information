<template>
  <div id="app">
    <Search :searchName="searchName" @receiveName="updateName" @receiveReset="updateReset"/>
    <Pagination :skipPage="skipPage" :total="total" @receivePage="updatePage" @receiveSkip="updateSkip"/>
    <UbikeTable :sortType="sortType" :filteredStops="filteredStops" @receive="updateReceive"/>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import UbikeTable from './components/UbikeTable.vue'
import Pagination from './components/Pagination.vue'

export default {
  name: 'App',
  components: {
    Search,
    UbikeTable,
    Pagination
  },
  data () {
    return {
      ubikeStops: [],
      searchName: '',
      sortType: '',
      currentPage: 1,
      skipPage: 0,
      total: 0
    }
  },
  created() {

    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

    fetch('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
        .then(res => res.json())
        .then(res => {
          // 將 json 轉陣列後存入 this.ubikeStops
          this.ubikeStops = Object.keys(res.retVal).map(key => res.retVal[key]);

          this.getTotal(this.ubikeStops);
        });

  },
  methods: {
    updateReset () {
      this.sortType = '';
      this.searchName = '';
      this.currentPage = 1;
      this.skipPage = 0;
    },
    updatePage(page) {
      this.currentPage = page;
    },
    updateSkip(count) {
      this.skipPage += count;
      this.currentPage += count * 10
    },
    getSort(sortType, ubikeList) {
      if (this.sortType === "useAsc")
        ubikeList.sort((a, b) => a.sbi - b.sbi);
      if (this.sortType === "useDesc")
        ubikeList.sort((a, b) => b.sbi - a.sbi);
      if (this.sortType === "parkingAsc")
        ubikeList.sort((a, b) => a.tot - b.tot);
      if (this.sortType === "parkingDesc")
        ubikeList.sort((a, b) => b.tot - a.tot);

      return ubikeList;
    },
    getTotal(ubikeList) {
      // 計算分頁
      this.total= ubikeList.length % 10 === 0
          ? parseInt(ubikeList.length / 10)
          : parseInt(ubikeList.length / 10 + 1);
    },
    updateReceive(val) {
      this.sortType = val;
    },
    updateName(val) {
      this.currentPage = 1;
      this.searchName = val;
    }
  },
  computed: {
    filteredStops() {
      let ubikeList = this.ubikeStops.filter((d) => d.sna.includes(this.searchName));

      // 計算分頁
      this.getTotal(ubikeList);

      // 處理排序
      this.getSort(this.sortType, ubikeList);

      let skip = (this.currentPage - 1) * 10;
      return ubikeList.slice(skip, skip + 10);
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body{ padding: 1em;  }
.pagination {
  display: inline-block;
  float: right!important;
  margin: 20px 0;
  border-radius: 4px;
}
.pagination > li {
  display: inline;
}
.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
  padding: 6px 12px;
  line-height: 1.42857143;
  text-decoration: none;
  color: #428bca;
  background-color: #ffffff;
  border: 1px solid #ededed;
  margin-left: -1px;
}
.pagination > li:first-child > a,
.pagination > li:first-child > span {
  margin-left: 0;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
.pagination > li:last-child > a,
.pagination > li:last-child > span {
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}
.pagination > li > a:hover,
.pagination > li > span:hover,
.pagination > li > a:focus,
.pagination > li > span:focus {
  color: #2a6496;
  background-color: #eeeeee;
  border-color: #ededed;
}
.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover,
.pagination > .active > a:focus,
.pagination > .active > span:focus {
  z-index: 2;
  color: #ffffff;
  background-color: #428bca;
  border-color: #428bca;
  cursor: default;
}
.pagination > .disabled > span,
.pagination > .disabled > span:hover,
.pagination > .disabled > span:focus,
.pagination > .disabled > a,
.pagination > .disabled > a:hover,
.pagination > .disabled > a:focus {
  color: #999999;
  background-color: #ffffff;
  border-color: #ededed;
  cursor: not-allowed;
}
</style>
