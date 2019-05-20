import treeTable from './TreeTable.vue';
import pagination from './Pagination.vue';
import search from './Search.vue';

function plugin(Vue) {
  if (plugin.installed){
    return;
  }
  Vue.component("CommonTreeTable",treeTable);
  Vue.component("CommonPagination",pagination);
  Vue.component("CommonSearch",search);
}
export default plugin
