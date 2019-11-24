$(function(){
  //把页面顶上的购物车气泡实现
  let arr = kits.loadData('cartListData');
  let total = 0;
  arr.forEach(e=>{
      total += e.number;
  })
  // kits.saveData('cartListData',arr);
$('.count').text(total);

})