<template>
  <div style="width: 30%">
    <div>
      <el-button @click="turnBack()">返回</el-button>
    </div>
    <div>
      <el-form :model="addTenantForm" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="addTenantForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间">
          <div class="block">
            <el-cascader
              v-model="value"
              :props="props"
              ref="cascader"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addTenantForm: {},
      rules: {},
      optionList: [],
      value: "",
      props: {
        lazy: true,
        lazyLoad: this.loadData,
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    handleChange(val) {
      console.log(val[0]);
    },
    loadData(node, resolve) {
      const { level } = node;
      console.log(node);
      if (level == 0) {
        this.getHouseDropDown().then((dropDown) => {
          resolve(dropDown);
        });
      } else {
        let a = node.data.value
        console.log(a)
        resolve([{ value: "111", label: "222" }]);
      }
    },
    getHouseDropDown() {
      return new Promise((resolve) => {
        this.request
          .post("/house/getHouseDropDown", {})
          .then((response) => {
            let houseList = response.data;
            var optionList = [];
            for (let house of houseList) {
              optionList.push({
                value: house.id,
                label: house.houseName,
                leaf: false,
              });
            }
            resolve(optionList);
          })
          .catch((error) => {
            console.log(error);
            resolve([]);
          });
      });
    },
    getRoomDropDown() {
      this.request.post("/room/getRoomDropDown", { houseId: "id" });
    },
  },
  mounted() {
    this.getHouseDropDown();
  },
};
</script>

<style>
</style>