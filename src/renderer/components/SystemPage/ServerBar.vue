<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active" v-on:click='getServers()' id="server-remote-list">
          <a class="nav-link text-light" href="#"> 远程服务器列表 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='getUsers()' id="server-user-setup">
          <a class="nav-link text-light" href="#"> 用户设置 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='test()' id="server-user-setup">
          <a class="nav-link text-light" href="#"> statCdaTest <span class="sr-only">(current)</span></a>
        </li>
        <li v-if="toolbar === 'getUsers' && user.login === true" v-on:click="updateUserPage()" id="server-user-change">
          <a class="nav-link text-light" href="#">修改</a>
        </li>
        <li class="nav-item active" v-on:click="docUser()" v-if="toolbar === 'getUsers' && user.login === true" id = "server-user-changepower">
          <a class="nav-link text-light" href="#"> 文件权限修改 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item dropdown" v-on:click='getOrgs()' id="server-org-setup">
          <a class="nav-link text-light dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 机构设置 <span class="sr-only">(current)</span></a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" id="orgInfos1" v-on:click="orgInfos('机构信息')">机构信息</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" id="orgInfos2" v-on:click="orgInfos('科室信息')">科室信息</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item active" v-if="toolbar === 'getOrgs' && orgPage === 'getOrg'" id = "server-user-neworg"  v-on:click="insertOrgPage()">
          <a class="nav-link text-light" href="#"> 新建机构 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="toolbar === 'createOrgs' && orgPage === 'getOrg' && orgName ==='insert'" id = "server-user-addorg"  v-on:click="insertOrg()">
          <a class="nav-link text-light" href="#"> 添加机构 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="toolbar === 'createOrgs' && orgPage === 'getOrg' && orgName ==='update'">
          <a class="nav-link text-light" href="#" v-on:click="updateOrg()"> 机构修改 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="toolbar === 'getOrgs' && orgPage === 'getDepartment'">
          <a class="nav-link text-light" href="#" id="newsection" v-on:click="insertDepPage()"> 新建科室 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="toolbar === 'createDepartments' && orgPage === 'getDepartment' && orgName ==='insertDep'">
          <a class="nav-link text-light" href="#" id="addsection" v-on:click="insertDep()"> 添加科室 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="toolbar === 'createDepartments' && orgPage === 'getDepartment' && orgName ==='updateDep'">
          <a class="nav-link text-light" href="#" v-on:click="updateDep()"> 科室修改 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='getPersons()' id="server-people-setup" v-if="this.$store.state.System.userPower === 1">
          <a class="nav-link text-light" href="#"> 人员设置 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-if="this.$store.state.System.userPower === 1 && toolbar === 'getPersons' && orgPage === 'getPerson'" v-on:click="updatePerson()">
          <a class="nav-link text-light" href="#"> 人员修改 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" id="sever-help-section" v-on:click='upHelp()'>
          <a class="nav-link text-light" href="#"> 增加帮助功能 <span class="sr-only">(current)</span></a>
        </li>
        <!-- <li class="nav-item active" v-on:click='getServerFunctions' id="server-remote-function-setup">
          <a class="nav-link text-light" href="#"> 远程服务功能设置 <span class="sr-only">(current)</span></a>
        </li> -->
      </ul>
      <!-- <div class="form-inline my-2 my-lg-0" v-if="['getPersons', 'getOrgs'].includes(this.$store.state.System.toolbar)">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" id="server-search">
      </div> -->
    </div>
  </nav>
</template>

<script>
  import { sGetProvince, sUpHelp } from '../../utils/Server';
  import { sGetUsers, sUpdateUser, sGetOrg, sCreateOrg, sUpdateOrg, sGetDepart, sCreateDepart, sUpdateDepart } from '../../utils/ServerUser';
  // import { open } from '../../utils/BlockAccount'
  import loadFile from '../../utils/LoadFile';
  import statCda from '../../utils/StatCda';
  export default {
    data() {
      return {
        paths: []
      };
    },
    computed: {
      server: {
        get() {
          return this.$store.state.System.server
        }
      },
      port: {
        get() {
          return this.$store.state.System.port
        }
      },
      toolbar: {
        get() {
          return this.$store.state.System.toolbar
        }
      },
      user: {
        get() {
          return this.$store.state.System.user
        }
      },
      userLogin: {
        get() {
          return this.$store.state.System.userLogin
        }
      },
      registerInfo: {
        get() {
          return this.$store.state.System.registerInfo
        }
      },
      upUserInfo: {
        get() {
          return this.$store.state.System.userUpdate
        }
      },
      personUpdate: {
        get() {
          return this.$store.state.System.personUpdate
        }
      },
      personId: {
        get() {
          return this.$store.state.System.personId
        }
      },
      orgInfo: {
        get() {
          return this.$store.state.System.orgInfo
        }
      },
      orgId: {
        get() {
          return this.$store.state.System.orgId
        }
      },
      orgPage: {
        get() {
          return this.$store.state.System.orgPage
        }
      },
      orgName: {
        get() {
          return this.$store.state.System.orgName
        }
      },
      departmentInfo: {
        get() {
          return this.$store.state.System.departmentInfo
        }
      },
      depId: {
        get() {
          return this.$store.state.System.departmentId
        }
      }
    },
    methods: {
      test: function () {
        statCda(this)
      },
      getServers: function () {
        loadFile(this, 'hitb_server.csv', 'system')
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'getServers');
        this.$store.commit('SET_NOTICE', '远程服务器列表');
      },
      getUsers: function () {
        if (!this.$store.state.System.connectInfo) {
          loadFile(this, 'hitb_server.csv', 'system')
        }
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'getUsers');
        this.$store.commit('SET_NOTICE', '用户设置');
      },
      getOrgs: function () {
        sGetProvince(this, [this.server, this.port])
        this.$store.commit('SYSTEM_SET_ORG_NAME', null);
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'getOrgs');
        if (!this.$store.state.System.user.login) {
          this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
        } else {
          sGetOrg(this, [this.server, this.port], this.$store.state.System.user, this.$store.state.System.pageInfo.org);
          this.$store.commit('SET_NOTICE', '机构设置');
        }
        //
      },
      getPersons: function () {
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'getPersons');
        this.$store.commit('SYSTEM_GET_ORGPAGE', 'getPersonTable');
        sGetUsers(this, [this.server, this.port], '1');
        this.$store.commit('SET_NOTICE', '人员设置');
      },
      getServerFunctions: function () {
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'getServerFunctions');
      },
      orgInfos: function (value) {
        if (!this.$store.state.System.user.login) {
          this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
        } else {
          switch (value) {
            case '机构信息':
              this.$store.commit('SYSTEM_GET_ORGPAGE', 'getOrg');
              this.$store.commit('SET_NOTICE', '机构信息');
              break;
            case '科室信息':
              this.$store.commit('SYSTEM_GET_ORGPAGE', 'getDepartment');
              sGetDepart(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.System.user, this.$store.state.System.pageInfo.department)
              this.$store.commit('SET_NOTICE', '科室信息');
              break;
            default:
          }
        }
      },
      updateUserPage: function () {
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'createUsers')
      },
      docUser: function () {
        sUpdateUser(this, [this.server, this.port], this.$store.state.System.user.id, { is_show: !this.$store.state.System.user.is_show })
      },
      updatePerson: function () {
        sUpdateUser(this, [this.$store.state.System.server], this.$store.state.System.port, this.personId, this.personUpdate)
      },
      insertOrgPage: function () {
        this.$store.commit('SYSTEM_SET_ORG_NAME', 'insert');
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'createOrgs')
      },
      insertOrg: function () {
        const reg = [/^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g, /^1[0-9]{10}$/]
        let a = 1
        let b = 1
        if (reg[0].test(this.orgInfo.email)) {
          a = 1
        } else {
          a = 0
          this.$store.commit('SET_NOTICE', '邮箱输入错误');
        }
        if (reg[1].test(this.orgInfo.tel)) {
          b = 1
        } else {
          b = 0
          this.$store.commit('SET_NOTICE', '电话输入错误');
        }
        if (a * b === 1) {
          sCreateOrg(this, [this.$store.state.System.server, this.$store.state.System.port], this.orgInfo)
        }
      },
      updateOrg: function () {
        sUpdateOrg(this, [this.$store.state.System.server, this.$store.state.System.port], this.orgId, this.orgInfo)
      },
      insertDepPage: function () {
        this.$store.commit('SYSTEM_SET_ORG_NAME', 'insertDep');
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'createDepartments')
      },
      insertDep: function () {
        sCreateDepart(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.System.user, this.departmentInfo);
      },
      updateDep: function () {
        sUpdateDepart(this, [this.$store.state.System.server, this.$store.state.System.port], this.depId, this.departmentInfo);
      },
      upHelp: function () {
        sUpHelp(this, [this.$store.state.System.server, this.$store.state.System.port], '专家提示', '')
      }
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  #navbarSupportedContent {
    background-image: linear-gradient(to right , #4772fe, #7997fa);
  }
  .nav-link {
    color:#ffffff;
  }
</style>
