<template>
  <view class="page">
    <view
      v-for="(tenant, index) in tenantList"
      :key="index"
      class="solid-bottom"
    >
      <view class="padding-sm flex">
        <view class="font-size-20">
          <text class="cuIcon-people margin-right-xs text-brown"></text>
        </view>
        <view class="font-size-17"> 姓名：{{ tenant.name }} </view>
      </view>
      <view class="padding-sm flex">
        <view class="font-size-20">
          <text class="cuIcon-phone margin-right-xs text-yellow"></text>
        </view>
        <view class="font-size-17"> 联系电话：{{ tenant.phone }} </view>
      </view>
      <view class="padding-sm flex">
        <view class="font-size-20">
          <text class="cuIcon-card margin-right-xs text-blue"></text>
        </view>
        <view class="font-size-17">
          身份证号码：{{ tenant.identifcationNumber }}
        </view>
      </view>
      <view class="padding-sm flex">
        <view class="font-size-20">
          <text class="cuIcon-homefill margin-right-xs text-brown"></text>
        </view>
        <view class="font-size-17">
          籍贯：{{ tenant.hometownProvince }}{{ tenant.hometownCity }}
        </view>
      </view>
      <view class="basis-xs padding-xs">
        <button class="cu-btn bg-red round" @click="deleteTenant(index)">
          删除
        </button>
      </view>
    </view>
    <view v-show="formShow">
      <form class="bg-gray">
        <view class="cu-form-group margin-top">
          <view class="title">姓名</view>
          <input placeholder="姓名" name="name" v-model="tenantForm.name" />
        </view>
        <view class="cu-form-group">
          <view class="title">联系电话</view>
          <input
            placeholder="联系电话"
            name="phone"
            v-model="tenantForm.phone"
          />
        </view>
        <view class="cu-form-group">
          <view class="title">身份证号码</view>
          <input
            placeholder="身份证号码"
            name="identifiNumber"
            v-model="tenantForm.identifcationNumber"
          />
        </view>
        <view class="cu-form-group">
          <view class="title"> 籍贯 </view>
          <picker
            mode="multiSelector"
            @change="hometownChange"
            :range="cityList"
            @columnchange="provinceChange"
          >
            <view>
              {{ tenantForm.hometown[0] }}-{{ tenantForm.hometown[1] }}
            </view>
          </picker>
        </view>
      </form>
      <view class="flex justify-start">
        <view class="padding">
          <button class="basis-xs cu-btn bg-green" @click="addTenant()">
            确定
          </button>
        </view>
        <view class="padding">
          <button class="basis-xs cu-btn bg-red" @click="hideTenantForm()">
            取消
          </button>
        </view>
      </view>
    </view>
    <view class="flex justify-start">
      <view class="padding">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="showTenantForm()"
        >
          添加房客
        </button>
      </view>
      <view class="padding">
        <button class="cu-btn bg-blue shadow-blur round lg" @click="saveAdd()">保存</button>
      </view>
    </view>
    <view class="cu-modal" :class="errorModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">输入错误</view>
          <view class="action" @tap="hideErrorModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view
          v-for="(item, index) in errorMessage"
          :key="index"
          class="padding text-lg"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Schema from "async-validator";
import region from "@/utils/cities.js";
Schema.warning = function () {};

export default {
  data() {
    return {
      id: "",
      tenantList: [
        {
          name: "123",
          phone: "123",
          identifcationNumber: "12312313123213",
          hometownProvince: "广东省",
          hometownCity: "东莞市",
        },
      ],
      formShow: false,
      tenantForm: {
        name: "",
        identifcationNumber: "",
        phone: "",
        hometown: [],
      },
      errorModal: false,
      errorMessage: [],
      rules: {
        name: {
          type: "string",
          required: true,
          message: "姓名不能为空",
        },
        phone: [
          {
            type: "string",
            required: true,

            message: "电话号码不能为空",
          },
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
          },
        ],
        identifcationNumber: [
          {
            type: "string",
            required: true,
            message: "身份证号码不能为空",
          },
          {
            pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请填写正确的身份证号码",
          },
          {
            validator: this.checkIdentificationNumberExist,
          },
        ],
      },

      cityList: [region.provinceList, region.getCityList("北京市")],
    };
  },
  methods: {
    showTenantForm() {
      this.formShow = true;
    },
    addTenant() {
      const validator = new Schema(this.rules);
      validator
        .validate(this.tenantForm)
        .then(() => {
          this.tenantList.push({
            name: this.tenantForm.name,
            identifcationNumber: this.tenantForm.identifcationNumber,
            phone: this.tenantForm.phone,
            hometownProvince: this.tenantForm.hometown[0],
            hometownCity: this.tenantForm.hometown[1],
          });
          this.hideTenantForm();
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            let messages = Object.keys(fields).map(
              (index) => fields[index][0].message
            );
            this.showErrorModal(messages);
          }
        });
    },
    deleteTenant(index) {
      this.tenantList.splice(index, 1);
    },
    hideTenantForm() {
      this.formShow = false;
      this.onTenantFormHide();
    },
    onTenantFormHide() {
      this.tenantForm = {
        name: "",
        identifcationNumber: "",
        phone: "",
        hometown: "",
      };
    },
    showErrorModal(messages) {
      this.errorMessage = messages;
      this.errorModal = true;
    },
    hideErrorModal() {
      this.errorModal = false;
    },
    checkIdentificationNumberExist(rule, value, callback) {
      this.request
        .post("/tenant/checkIdNumber", { identificationNumber: value })
        .then((response) => {
          let { data } = response;
          if (data) {
            callback(new Error("身份证号码已存在"));
          } else {
            callback();
          }
        });
    },
    hometownChange(e) {
      console.log(e.detail.value);
      let provinceIndex = e.detail.value[0];
      let cityIndex = e.detail.value[1];
      this.tenantForm.hometown = [
        this.cityList[0][provinceIndex],
        this.cityList[1][cityIndex],
      ];
    },
    provinceChange(e) {
      if (e.detail.column === 0) {
        this.cityList[1] = region.getCityList(this.cityList[0][e.detail.value]);
      }
    },
    saveAdd(){
      
    }
  },
  onLoad(params) {
    this.id = params.roomId;
  },
};
</script>

<style>
.cu-form-group .title {
  min-width: calc(4em + 15px);
}

.font-size-17 {
  font-size: 17px;
}

.font-size-20 {
  font-size: 20px;
}
</style>