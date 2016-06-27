// *
//  * @file 左侧导航高亮配置文件
//  *
//  * params 多参匹配
//  * ---string---
//  * {
//  *      'params': {
//  *          tplpath: 'nerve_marketing-page-activitymanager-list',
//  *          action: 'queryactivity'
//  *       }
//  * }
//  * ---regexp---
//  * {
//  *      'params': {
//  *          tplpath: 'nerve_marketing-page-activitymanager-list',
//  *          action: 'queryactivity'
//  *          id: /\d+/
//  *       }
//  * }
//  * ---function---
//  * {
//  *      'params': {
//  *          tplpath: 'nerve_marketing-page-activitymanager-list',
//  *          action: function(v){
//  *              if(v==='queryactivity'){
//  *                  return true;
//  *              }
//  *              return false;
//  *          }
//  *       }
//  * }
//  * 更改显示规则后，此文件并无卵用
// module.exports = {
//     // 首页
//     index: [{
//         'data-node': 'index'
//     }],
//     list: [{
//     	'data-node': 'orderlist'
//     }]
// };