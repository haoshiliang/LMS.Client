/**
 * 动态添加菜单
 * author:qlx
 */
const addMenus = {
  state: {
    menuList: []
  },
  mutations: {
    add_Menus(state, param) {
        if(param){
            var menuList=[];
             _addMenu(menuList,param);
             state.menuList=menuList;
        }
        function _addMenu(menuList,params){
            for(var i=0;i<params.length;i++){
                 var menu={
                        icon: 'el-icon-tickets',
                        index: '1',
                        title: '工作台',
                        isAllowClose:true,
                        subs: []
                };
                var menuParam=params[i];
                 if(menuParam.IsFunction == true){
                    continue;
                }
                menu.icon=menuParam.Icon;
                menu.index=menuParam.ModulePath;
                menu.title=menuParam.Name;
                menu.isAllowClose=true;
                if(menuParam.ChildList && menuParam.ChildList.length>0){
                    _addMenu(menu.subs,menuParam.ChildList);
                }
                menuList.push(menu);
            }
        }
    }
  },
  actions: {
    add_Menus({commit}, param) {
      commit('add_Menus', param)
    }
  }
}
export default addMenus
