<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-if="this.$store.state.Edit.hintType === 'notice'">
      <div v-bind:style="isShowStyle" class="alert alert-warning" id="edit-bar-prompt" role="alert" style="width: 100%; position: fixed; bottom: 40px">
        <span v-on:click='inviteUser(hint)'>{{hint}}</span>
      </div>
    </nav>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-if="this.$store.state.Edit.hintType === 'hint'">
      <div class="alert alert-warning" id="edit-bar-prompt" role="alert" style="width: 100%; position: fixed; bottom: 40px">
        <span v-for="(data, index) in hint" v-bind:key='index' v-bind:style="isShowStyle">{{data}}</span>
      </div>
    </nav>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-bottom">
      <div class="btn-group dropup">
        <button type="button" class="btn btn-info dropdown-toggle" href="#" id="edit-rightbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{editType}}
        </button>
        <div class="dropdown-menu">
          <a v-on:click='changeEditType("在线交流")' class="dropdown-item" href="#">在线交流</a>
          <a v-on:click='changeEditType("病案编辑")' class="dropdown-item" href="#">病案编辑</a>
        </div>
      </div>
      <input id="edit-editbar-input" style="line-height: 3" type="text" class="form-control"
      placeholder="请输入……" aria-label="Username" aria-describedby="basic-addon1" v-model="item"
      v-on:click="show()"
      v-on:input="change" v-on:keydown.enter="enter" v-on:keyup.ctrl.delete="del()" v-on:keyup.ctrl.enter="addItem()"
      v-on:keyup.up="up()" v-on:keyup.down="down()"
      v-on:keydown.ctrl.up="itemUp()" v-on:keydown.ctrl.down="itemDown()"
      v-on:keyup.space="space()" v-on:keyup.left="space()" v-on:keyup.right="space()"
      v-on:keyup.ctrl.0="hintUp()" v-on:keyup.ctrl.110="hintDown()"
      v-on:keyup.ctrl.97="hintSet(1)" v-on:keyup.ctrl.49="hintSet(1)"
      v-on:keyup.ctrl.98="hintSet(2)" v-on:keyup.ctrl.50="hintSet(2)"
      v-on:keyup.ctrl.99="hintSet(3)" v-on:keyup.ctrl.51="hintSet(3)"
      v-on:keyup.ctrl.100="hintSet(4)" v-on:keyup.ctrl.52="hintSet(4)"
      v-on:keyup.ctrl.101="hintSet(5)" v-on:keyup.ctrl.53="hintSet(5)"
      v-on:keyup.ctrl.102="hintSet(6)" v-on:keyup.ctrl.54="hintSet(6)"
      v-on:keyup.ctrl.103="hintSet(7)" v-on:keyup.ctrl.55="hintSet(7)"
      v-on:keyup.ctrl.104="hintSet(8)" v-on:keyup.ctrl.56="hintSet(8)"
      v-on:keyup.ctrl.105="hintSet(9)" v-on:keyup.ctrl.57="hintSet(9)"
      v-on:keyup.ctrl.space="changeEditType()" v-on:keyup.shift.46="empty()">
    </nav>
  </div>
</template>

<script>
  import { join } from '../../utils/Socket'
  import { editBarEnter } from '../../utils/EditSave'
  export default {
    // mounted: function () {
    //   this.$nextTick(() => {
    //     document.getElementById('edit-editbar-input').focus()
    //   })
    // },
    computed: {
      editType: {
        get() {
          return this.$store.state.Edit.editType
        },
        set() {}
      },
      item: {
        get() {
          const x = this.$store.state.Edit.editBarValue
          if (x) { return this.$store.state.Edit.editBarValue.toString().replace(/,/g, '  ') }
          return ''
        },
        set: function () {
        }
      },
      hint: {
        get() {
          let content1 = []
          if (this.$store.state.Edit.hintType === 'hint' && this.$store.state.Edit.hint && this.$store.state.Edit.hint.length >= 1) {
            const hintSkip = this.$store.state.Edit.hintPage
            const num = hintSkip * 9
            const hint = this.$store.state.Edit.hint.slice(num, num + 9)
            const hint1 = hint.map((x, index) => index + 1 + '.'.concat(x))
            content1 = hint1
          } else {
            content1 = '系统通知：'.concat(this.$store.state.Home.notice)
          }
          return content1
        }
      },
      isShowStyle() {
        let style = 'margin-right: 0px'
        if (this.$store.state.Edit.hintType === 'hint') {
          style = 'margin-right: 20px'
        }
        return style
      }
    },
    methods: {
      inviteUser(data) {
        if (data.includes('邀请您进入')) {
          join(this, this.$store.state.Edit.fileName, this.$store.state.Edit.socketRecord[this.$store.state.Edit.socketRecord.length - 1].room)
        }
      },
      show() {
        this.$store.commit('EDIT_SET_LEFT_PANEL', 'doc')
      },
      change(e) {
        if (this.$store.state.Edit.editType === '病案编辑') {
          if (e.target.value.includes('~')) {
            this.$store.commit('EDIT_SET_MODEL_NAME', e.target.value.replace('~', ''));
          } else {
          // const value = document.getElementById('edit-editbar-input').value
            const value = e.target.value
            this.$store.commit('EDIT_SET_BAR_VALUE', value);
            let n = this.$store.state.Edit.docIndex
            if (this.$store.state.Edit.selectedType !== 'col') {
              const vs = value.split(',').filter(i => i !== '');
              if (vs.length > 0) {
                vs.forEach((element, index) => {
                  const v = element.split(' ').filter(i => i !== '');
                  if (v.length > 0) {
                    if (index > 0) {
                      this.$store.commit('EDIT_UPDATE_DOC', [n, v, true]);
                    } else {
                      this.$store.commit('EDIT_UPDATE_DOC', [n, v]);
                    }
                    n += 1
                  }
                });
              } else {
                this.$store.commit('EDIT_UPDATE_DOC', [n, ' ', false]);
                // this.$store.commit('EDIT_DELETE_ITEM', n);
              }
            }
          }
        }
      },
      enter(e) {
        editBarEnter(this, e.target.value)
      },
      addItem() {
        // if (this.$store.state.Edit.fileType === 'cda') {
        this.$store.commit('EDIT_ADD_ITEM');
        // }
      },
      up() {
        this.$store.commit('EDIT_SET_DOC_INDEX', [-1]);
        const value = this.$store.state.Edit.editBarValue
        if (global.hitbSections.includes(value[0])) {
          this.$store.commit('EDIT_SET_SECTION', value[0]);
        }
      },
      down() {
        this.$store.commit('EDIT_SET_DOC_INDEX', [1]);
        const value = this.$store.state.Edit.editBarValue
        if (global.hitbSections.includes(value[0])) {
          this.$store.commit('EDIT_SET_SECTION', value[0]);
        }
      },
      itemUp() {
        if (this.$store.state.Edit.docIndex > 0 && this.$store.state.Edit.fileType === 'cda') {
          if (this.$store.state.Edit.doc.length > this.$store.state.Edit.docIndex) {
            const n1 = this.$store.state.Edit.docIndex - 1
            const v1 = this.$store.state.Edit.doc[n1]
            const n2 = this.$store.state.Edit.docIndex
            const v2 = this.$store.state.Edit.doc[n2]
            this.$store.commit('EDIT_UPDATE_DOC', [n1, v2]);
            this.$store.commit('EDIT_UPDATE_DOC', [n2, v1]);
          }
        }
      },
      itemDown() {
        if (this.$store.state.Edit.docIndex < this.$store.state.Edit.doc.length - 1 && this.$store.state.Edit.fileType === 'cda') {
          const n1 = this.$store.state.Edit.docIndex
          const v1 = this.$store.state.Edit.doc[n1]
          const n2 = this.$store.state.Edit.docIndex + 1
          const v2 = this.$store.state.Edit.doc[n2]
          this.$store.commit('EDIT_UPDATE_DOC', [n1, v2]);
          this.$store.commit('EDIT_UPDATE_DOC', [n2, v1]);
        }
      },
      del() {
        if (this.$store.state.Edit.fileType === 'cda') {
          const n1 = this.$store.state.Edit.docIndex
          this.$store.commit('EDIT_DELETE_ITEM', n1);
        }
      },
      space() {
        this.$store.commit('EDIT_SET_HINT_TYPE', 'hint');
        const aa = document.getElementById('edit-editbar-input')
        const start = aa.selectionStart;
        if (start > 0 && this.$store.state.Edit.editBarValue[start - 1] === ' ') {
          const value = this.$store.state.Edit.editBarValue.slice(0, start)
          const value1 = value.replace(/\s/ig, '')
          const searchKeys = []
          global.hitbdata.cdhHeader.forEach((n) => {
            if (n.includes(value1)) {
              searchKeys.push(n)
            }
          })
          const obj = {}
          searchKeys.forEach((n) => {
            obj[n] = global.hitbdata.cdh[n]
          })
          this.$store.commit('EDIT_SET_CDH', 'search');
          this.$store.commit('EDIT_GET_RIGHT_CDH', obj);
          if (global.hitbdata.cdh[value1] !== undefined) {
            this.$store.commit('EDIT_SET_HINT_TYPE', 'hint');
            this.$store.commit('EDIT_SET_HINT', global.hitbdata.cdh[value1]);
            // this.$store.commit('EDIT_SET_HINT_TYPE', 'hint');
          } else {
            this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
            this.$store.commit('SET_NOTICE', '无提示信息');
          }
        }
      },
      hintUp() {
        this.$store.commit('EDIT_SET_HINT_TYPE', 'hint');
        if (this.$store.state.Edit.hintPage > 0 && this.$store.state.Home.notice !== '当前提示已为最后一页') {
          this.$store.commit('EDIT_SET_HINT_PAGE', 'down');
        } else if (this.$store.state.Home.notice === '当前提示已为最后一页') {
          this.$store.commit('SET_NOTICE', '');
          this.$store.commit('EDIT_SET_HINT_PAGE', '0');
        } else {
          this.$store.commit('SET_NOTICE', '当前提示已为第一页');
          this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        }
      },
      hintDown() {
        this.$store.commit('EDIT_SET_HINT_TYPE', 'hint');
        const pageNum = Math.ceil(this.$store.state.Edit.hint.length / 9)
        if (this.$store.state.Edit.hintPage < pageNum - 1 && this.$store.state.Home.notice !== '当前提示已为第一页') {
          this.$store.commit('EDIT_SET_HINT_PAGE', 'up');
        } else if (this.$store.state.Home.notice === '当前提示已为第一页') {
          this.$store.commit('SET_NOTICE', '');
          this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
          this.$store.commit('EDIT_SET_HINT_PAGE', '0');
        } else {
          this.$store.commit('SET_NOTICE', '当前提示已为最后一页');
          this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        }
      },
      hintSet(num) {
        const index = (this.$store.state.Edit.hintPage + 1) * 9
        const value = this.$store.state.Edit.hint.slice(index - 9, index)
        this.$store.commit('EDIT_CONCAT_BAR_VALUE', value[num - 1]);
        this.item = this.$store.state.Edit.editBarValue;
      },
      changeEditType(type) {
        if (type) {
          this.$store.commit('EDIT_SET_EDIT_TYPE', type);
        } else if (this.$store.state.Edit.editType === '在线交流') {
          // this.$store.commit('EDIT_SET_CHAT_TYPE', true)
          this.$store.commit('EDIT_SET_EDIT_TYPE', '在线交流');
        } else {
          // this.$store.commit('EDIT_SET_CHAT_TYPE', false)
          this.$store.commit('EDIT_SET_EDIT_TYPE', '病案编辑');
        }
      },
      empty() {
        this.$store.commit('EDIT_SET_BAR_VALUE', '');
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
  input {
    width: 100%
  }
</style>
