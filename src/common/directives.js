// directives.js
import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    // 获取拖拽内容整体 这个rrc-dialog是我自己封装的组件 如果使用element的组件应写成.el-dialog
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const initLeft = offset(dialogHeaderEl,"Left");
      const initTop = offset(dialogHeaderEl,"Top");
      const disX = e.clientX - initLeft;
      const disY = e.clientY - initTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      };

      // 鼠标拖拽事件
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX - initLeft;
        const t = e.clientY - disY - initTop;

        let finallyL = l + styL
        let finallyT = t + styT

        // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
        // dragDom.offsetParent表示弹窗阴影部分
        /*if (finallyL < initLeft * -1) {
          finallyL = initLeft * -1
        } else if (finallyL > dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft-initLeft) {
          finallyL = dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft-initLeft-5
        }

        if (finallyT < initTop * -1) {
          finallyT = initTop * -1
        } else if (finallyT > dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetTop-initTop) (
          finallyT = dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetTop-initTop
        )*/

        // 移动当前元素
        dragDom.style.left = `${finallyL}px`;
        dragDom.style.top = `${finallyT}px`;

        //将此时的位置传出去
        //binding.value({x:e.pageX,y:e.pageY})
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
})
function offset(obj,direction){
  //将top,left首字母大写,并拼接成offsetTop,offsetLeft
  var offsetDir = 'offset'+ direction[0].toUpperCase()+direction.substring(1);

  var realNum = obj[offsetDir];
  var positionParent = obj.offsetParent;  //获取上一级定位元素对象

  while(positionParent != null){
    realNum += positionParent[offsetDir];
    positionParent = positionParent.offsetParent;
  }
  return realNum;
}
