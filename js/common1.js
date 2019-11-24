//
// 先获取本地数据
$(function(){
  let arr = kits.loadData('cartListData');
//   console.log(arr);
let numbers = 0;
  arr.forEach(e=>{
      numbers += e.number;
  })
// 更改页面上的值
$('.count').text(numbers);

})