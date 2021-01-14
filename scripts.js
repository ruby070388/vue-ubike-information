const vm = Vue.createApp({
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
    methods: {
      timeFormat(t){

        var date = [], time = [];

        date.push(t.substr(0, 4));
        date.push(t.substr(4, 2));
        date.push(t.substr(6, 2));
        time.push(t.substr(8, 2));
        time.push(t.substr(10, 2));
        time.push(t.substr(12, 2));

        return date.join("/") + ' ' + time.join(":");
      },
      reset () {
          this.sortType = '';
          this.searchName = '';
          this.currentPage = 1;
          this.skipPage = 0;
      },
      selectPage(page) {
          this.currentPage = page + (this.skipPage * 10)
      },
      skip(count) {
          this.skipPage += count;
          this.currentPage += count * 10
      },
      getSort(sortType, ubikeList)
      {
          if (this.sortType === "useAsc")
              ubikeList.sort((a, b) => a.sbi - b.sbi);
          if (this.sortType === "useDesc")
              ubikeList.sort((a, b) => b.sbi - a.sbi);
          if (this.sortType === "parkingAsc")
              ubikeList.sort((a, b) => a.tot - b.tot);
          if (this.sortType === "parkingDesc")
              ubikeList.sort((a, b) => b.tot - a.tot);

          return ubikeList;
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

              this.total = this.ubikeStops.length % 10 === 0
                  ? parseInt(this.ubikeStops.length / 10)
                  : parseInt(this.ubikeStops.length / 10 + 1);
          });

    },
    computed: {
        filteredStops() {
            let ubikeList = this.ubikeStops.filter((d) => d.sna.includes(this.searchName));
            // 計算分頁
            this.total = ubikeList.length % 10 === 0
                ? parseInt(ubikeList.length / 10)
                : parseInt(ubikeList.length / 10 + 1);

            // 處理排序
            this.getSort(this.sortType, ubikeList);

            let skip = (this.currentPage - 1) * 10;
            return ubikeList.slice(skip, skip + 10);
        },
    },
}).mount('#app');