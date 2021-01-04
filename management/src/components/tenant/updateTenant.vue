<template>
  <div class="content">
    <div>
      <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
        >返回</el-button
      >
    </div>
    <div style="width: 30%">
      <el-form
        :model="updateTenantForm"
        :rules="rules"
        ref="updateTenantForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="updateTenantForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="room">
          <el-cascader
            v-model="updateTenantForm.room"
            :props="props"
            ref="roomCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="updateTenantForm.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="updateTenantForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="identificationNumber">
          <el-input
            type="text"
            v-model="updateTenantForm.identificationNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            type="date"
            v-model="updateTenantForm.birthday"
            placeholder="选择日期"
            format="YYYY 年 M 月 D 日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-cascader
            v-model="updateTenantForm.hometown"
            :options="cities"
            ref="hometownCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('updateTenantForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('updateTenantForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import provinces from '../../utils/cities.js'
export default {
    data(){
        return{
            tenantInfo:{},
            updateTenantForm:{},
            id:0,
            provinceList: provinces,
        }
    }
};
</script>

<style>
</style>