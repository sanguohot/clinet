<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="library-dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            文件
          </a>
          <div class="dropdown-menu" aria-labelledby="library-dropdown">
            <a v-for="(data, index) in fileTypes" v-bind:key='index' class="nav-link" href="#" v-on:click='libraryFile(data)' v-bind:id="'library-file-'+data">{{data}}</a>
            <!-- <a class="nav-link" href="#" title="显示本地文件" v-on:click='loadData()'> 本地 <span class="sr-only">(current)</span></a>
            <a class="nav-link" href="#" title="显示远程文件" v-on:click='serverData()'> 远程 <span class="sr-only">(current)</span></a>
            <a class="nav-link" href="#" title="显示区块链文件" v-on:click='blockData()'> 区块链 <span class="sr-only">(current)</span></a> -->
          </div>
        </li>
        <!-- <li class="nav-item active" v-on:click='loadData()' id="library-local-file">
          <a class="nav-link text-light" href="#" title="显示本地文件"> 本地 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='serverData()' id="library-remote-file">
          <a class="nav-link text-light" href="#" title="显示远程文件"> 远程 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='blockData()' id="library-block-file">
          <a class="nav-link text-light" href="#" title="显示区块链文件"> 区块链 <span class="sr-only">(current)</span></a>
        </li> -->

        <li class="nav-item active" v-if ="this.$store.state.Library.tableType === 'server'" v-on:click='blockShare()' id="library-block-file">
          <a class="nav-link text-light" href="#" title="分享选中记录"> 分享 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='page(-1)' id="library-up">
          <a class="nav-link text-light" href="#" title="向前翻页"> 前页 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='page(1)' id="library-down">
          <a class="nav-link text-light" href="#" title="向后翻页"> 后页 <span class="sr-only">(current)</span></a>
        </li>
        <li v-if="this.$store.state.Library.tableType === 'server'" class="nav-item active" v-on:click='docDown()' id="library-doc-down">
          <a class="nav-link text-light" href="#" title="下载该文件到本地"> 下载 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active" v-on:click='edit()' id="library-edit">
          <a class="nav-link text-light" href="#" title="跳转到编辑来编辑该文件"> 编辑数据 <span class="sr-only">(current)</span></a>
        </li>
        <li v-if="this.$store.state.Library.tableType === 'server' && libraryList.time.length !== 0" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="library-right-dimension-time" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            时间
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="height: 10rem; overflow: auto">
              <a v-for="(data, index) in libraryList.time" v-bind:key='index' v-on:click='selX(data, "time")' class="nav-link" href="#"  v-bind:id="'library-td-time-tr'+index" > {{data}} <span class="sr-only">(current)</span></a>
          </div>
        </li>
        <li v-if="this.$store.state.Library.tableType === 'server' && libraryList.version.length !== 0" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="library-right-dimension-version" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            版本
          </a>
           <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="height: 10rem; overflow: auto">
              <a v-for="(data, index) in libraryList.version" v-bind:key='index' v-on:click='selX(data, "version")' class="nav-link" href="#"  v-bind:id="'library-td--version-tr'+index" > {{data}} <span class="sr-only">(current)</span></a>
          </div>
        </li>
        <li class="nav-item dropdown" v-if="this.$store.state.Library.tableType !== 'server'">
          <a class="nav-link dropdown-toggle text-light" href="#" id="library-dropdown1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            维度选择
          </a>
          <div class="dropdown-menu" aria-labelledby="library-dropdown1">
            <a v-for="(data, index) in dropdownTypes" v-bind:key='index' class="nav-link" href="#" v-on:click='selX(data, "local")' v-bind:id="'library-dropdown-'+data">{{data}}</a>
            <!-- <a class="nav-link" href="#" v-on:click='selX("机构")' id="library-dropdown-org"> 机构 <span class="sr-only">(current)</span></a> -->
            <!-- <a class="nav-link" href="#" v-on:click='selX("year")' id="library-dropdown-time"> 年份 <span class="sr-only">(current)</span></a>
            <a class="nav-link" href="#" v-on:click='selX("version")' id="library-dropdown-version"> 版本 <span class="sr-only">(current)</span></a>
            <a class="nav-link" href="#" v-on:click='selX("all")' id="library-dropdown-version"> 全部 <span class="sr-only">(current)</span></a> -->
            <div class="dropdown-divider"></div>
            <!-- <a class="nav-link" href="#" v-on:click='selX(null)'> 添加列维度 <span class="sr-only">(current)</span></a> -->
          </div>
        </li>
      </ul>
      <div class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-on:keyup.13="librarySearch()" v-model="library">
      </div>
    </div>
  </nav>
</template>

<script>
  import { getLibraryFiles, getLibrary, librarDown, getLibrarySerach } from '../../utils/LibraryServerFile';
  import { share } from '../../utils/Server';
  import loadFile from '../../utils/LoadFile';
  export default {
    data() {
      return {
        paths: [],
        library: ''
      };
    },
    computed: {
      fileTypes: {
        get() {
          return this.$store.state.Library.fileTypes
        }
      },
      dropdownTypes: {
        get() {
          return this.$store.state.Library.dropdownTypes
        }
      },
      libraryList: {
        get() {
          return this.$store.state.Library.libraryList
        }
      }
    },
    methods: {
      libraryFile: function (n) {
        if (n === '本地') {
          this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
          this.$store.commit('LIBRARY_LOAD_FILES');
          this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'local');
          this.$store.commit('SET_NOTICE', '本地文件');
        } else if (n === '远程') {
          if (!this.$store.state.System.user.login) {
            this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
          } else {
            this.$store.commit('SET_NOTICE', '远程文件');
            this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server');
            this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
            getLibraryFiles(this, [this.$store.state.System.server, this.$store.state.System.port], 'server')
          }
        } else if (n === '区块链') {
          if (!this.$store.state.System.user.login) {
            this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
          } else {
            this.$store.commit('SET_NOTICE', '区块链文件');
            this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'block');
            this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
            getLibraryFiles(this, [this.$store.state.System.server, this.$store.state.System.port], 'block')
          }
        }
      },
      page: function (n) {
        if (this.$store.state.Library.libraryTableInfo.page === 1 && n === -1) {
          this.$store.commit('SET_NOTICE', '当前已是第一页')
        } else if ((this.$store.state.Library.libraryTableInfo.page === this.$store.state.Library.libraryTableInfo.countPage && n === 1) || this.$store.state.Library.countPage === 0) {
          this.$store.commit('SET_NOTICE', '当前已是尾页');
        } else if (this.$store.state.Library.tableType === 'server' || this.$store.state.Library.tableType === 'block') {
          this.$store.commit('LIBRARY_TABLE_PAGE', [n]);
          getLibrary(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Library.libraryTableInfo.tableName, this.$store.state.Library.libraryTableInfo.page, this.$store.state.Library.dimensionType, this.$store.state.Library.dimensionServer, 'library', this.$store.state.Library.tableType, this.$store.state.Library.serverSort)
        } else if (this.$store.state.Library.tableType === 'local') {
          this.$store.commit('LIBRARY_TABLE_PAGE', [n]);
          this.$store.commit('SET_NOTICE', `当前${this.$store.state.Library.libraryTableInfo.page}页,共${this.$store.state.Library.libraryTableInfo.countPage}页`)
        }
      },
      edit: function () {
        let f = []
        if (this.$store.state.Library.tableType === 'local') {
          this.$store.commit('EDIT_SET_RIGHT_PANELS', '本地文件');
          this.$store.commit('EDIT_SET_RIGHT_FOLDS', '本地文件');
          if (this.$store.state.Library.libraryTable.data.includes(undefined)) {
            f = this.$store.state.Library.libraryTable.data.filter(x => x !== undefined)
          } else {
            f = this.$store.state.Library.libraryTable.data
          }
        }
        if (this.$store.state.Library.tableType === 'server') {
          this.$store.commit('EDIT_SET_RIGHT_PANELS', '远程文件');
          this.$store.commit('EDIT_SET_RIGHT_FOLDS', '远程文件');
          this.$store.commit('EDIT_SET_LEFT_PANEL', 'table');
          this.$store.commit('EDIT_SET_RIGHT_PANEL', 'server');
          this.$store.commit('EDIT_SET_FILES_INDEX', 0);
          this.$store.commit('EDIT_SET_LEFT_PANEL', 'table')
        } else {
          if (this.$store.state.Library.fileIndex !== null) {
            this.$store.commit('EDIT_SET_LEFT_PANEL', 'table');
            this.$store.commit('EDIT_LOAD_FILE', f);
          }
          this.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
          this.$store.commit('EDIT_SET_FILES_INDEX', this.$store.state.Library.fileIndex);
        }
        this.$store.commit('EDIT_SET_LAST_NAV', '/library');
        this.$router.push('/edit');
        this.$store.commit('EDIT_SET_BAR_VALUE', '');
      },
      selX: function (value, x) {
        switch (this.$store.state.Library.tableType) {
          case 'local': {
            if (this.$store.state.Library.libraryTable.data.length > 0) {
              console.log(value)
              switch (x) {
                case '全部':
                  this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
                  loadFile(this, this.$store.state.Library.files[this.$store.state.Library.fileIndex], 'library')
                  break;
                case '年份':
                  this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', 'year']);
                  this.$store.commit('SET_NOTICE', '维度选择');
                  break;
                case '版本':
                  this.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', 'version']);
                  this.$store.commit('SET_NOTICE', '维度选择');
                  break;
                default:
              }
            } else {
              this.$store.commit('SET_NOTICE', '请选择文件');
            }
            break;
          }
          case 'server': {
            if (this.$store.state.Library.libraryTableInfo.tableName) {
              this.$store.commit('LIBRARY_SET_SERVER_DIMENSION', [value, x]);
              console.log(this.$store.state.Library.serverDimension)
              getLibrary(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Library.libraryTableInfo.tableName, 1, 'filter', this.$store.state.Library.serverDimension, 'edit', 'server', this.$store.state.Library.serverSort)
            } else {
              this.$store.commit('SET_NOTICE', '请选择文件');
            }
            break;
          }
          default: {
            break;
          }
        }
      },
      librarySearch: function () {
        switch (this.$store.state.Library.tableType) {
          case 'local':
            this.$store.commit('LIBRARY_GET_SEARCH_TABLE', this.library)
            break;
          case 'server':
            getLibrarySerach(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Library.libraryTableInfo.tableName, this.library, 'server')
            break;
          case 'block':
            getLibrarySerach(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Library.libraryTableInfo.tableName, this.library, 'block')
            break;
          default:
        }
      },
      blockShare: function () {
        let array = []
        array = this.$store.state.Library.fieldIndex.map(n => this.$store.state.Library.libraryTable.data[n])
        share(this, [this.$store.state.System.server, this.$store.state.System.port], 'library', this.$store.state.System.shareFileName, this.$store.state.System.user.username, array)
      },
      docDown: function () {
        if (this.$store.state.Library.tableType === 'server') {
          const filename = this.$store.state.System.shareFileName
          librarDown(this, [this.$store.state.System.server, this.$store.state.System.port], filename);
        }
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
  .nav-item {
    color:#ffffff;
  }
  .nav-link {
    color:#000000;
  }

</style>
