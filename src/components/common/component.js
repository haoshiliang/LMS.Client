import treeTable from './TreeTable.vue';
import pagination from './Pagination.vue';

function plugin(Vue) {
  if (plugin.installed){
    return;
  }
  Vue.component("CommonTreeTable",treeTable);
  Vue.component("CommonPagination",pagination);
}
export default plugin
