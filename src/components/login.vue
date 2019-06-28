<template>
    <div class="login_wrapper">
        <div class="login">
            <el-form :model="formLogin">
                <el-form-item>
                    <h2 class="title">后台管理系统</h2>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formLogin.loginName" :disabled="isDisabled" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formLogin.password" show-password :disabled="isDisabled" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login" :loading="showLoading">登陆</el-button>
                    <span v-show="this.errorInfo.isShowError" class='error'>
                        {{this.errorInfo.text}}
                    </span>
                </el-form-item>

            </el-form>

        </div>
        <p class="bei">京ICP备18050367号-1</p>
    </div>
</template>

<style lang="scss">
$input_width:300px;

.login_wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .login {
        width: 460px;
        height: 296px;
        margin-top: -150px;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            text-align: center;
            color: #505458;
        }
        .el-form-item__content {
            width: $input_width;
        }
        .el-button {
            width: $input_width;
        }
        .el-form {
            margin: 30px 80px auto 80px;
            .error {
                display: block;
                text-align: center;
                color: red;
            }
        }
    }
}
.bei{
    position:absolute;
    bottom:20px;
    cursor:pointer;
    color:#505458;
}
</style>

<script>
import apis from '../apis/apis';
export default {
    name: 'login',
    data() {
        return {
            formLogin: {   //表单对象
                loginName: 'admin',
                password: '123'
            },
            errorInfo: {
                text: '登陆失败,请重试',
                isShowError: false //显示错误提示
            },
            showLoading:false,
            isDisabled:false
        }
    },
    mounted() {
        document.onkeydown = (event) => {
            var router=this.$route.path;
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13&&this.$route.path=='/login') { // enter 键
                this.login();
            }
        };
    },
    methods: {
        login() {
            //调用后端登陆接口
            this.showLoading=true;
            this.isDisabled=true;
            apis.shiroApi.loginIn(this.formLogin)
                .then((data) => {
                    this.showLoading=false;
                    this.isDisabled=false;
                    if (data && data.data) {
                        var json = data.data;
                        if (json.status == '1') {
                            this.$common.setSessionStorage('token', json.data.Ticket);
                            this.$common.setSessionStorage('username',json.data.UserInfo.Name);
                            this.$common.setSessionStorage('loginName',json.data.UserInfo.LoginName);
                            this.$common.setSessionStorage('menuList',json.data.SysRoleVoList);
                            //存入菜单,渲染菜单
                            this.$store.dispatch("add_Menus",json.data.SysRoleVoList);
                             //动态设置路由
                            this.$store.dispatch("add_Routes", json.data.SysRoleVoList);
                            this.$router.replace({ path: "/index" });
                            apis.shiroApi.setToken(json.data.Ticket);

                            var loginLog={
                                ip:returnCitySN["cip"],
                                city:returnCitySN["cname"]+'-'+json.data.UserName+'-登陆'
                            };
                            return;
                        }
                        else if (json.message) {
                            this.errorInfo.text = json.message;
                        }
                    }
                    this.errorInfo.isShowError = true;
                    //this.$store.dispatch("loginLog",loginLog);
                })
                .catch((err) => {
                    this.showLoading = false;
                    this.isDisabled=false;
                    this.errorInfo.isShowError = true;
                    this.errorInfo.text = '系统接口异常';
                });

        }
    }
}
</script>
