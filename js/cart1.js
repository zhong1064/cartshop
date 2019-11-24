$(function(){
   // 先获取本地数据 生成页面结构
   let arr = kits.loadData('cartListData');
//    console.log(arr)
   let jg = '';
    arr.forEach(e=>{
        jg += `<div class="item" data-id="${e.pID}">
        <div class="row">
          <div class="cell col-1 row">
            <div class="cell col-1">
              <input type="checkbox" class="item-ck" ${e.isChecked ? "checked" : ''}>
            </div>
            <div class="cell col-4">
              <img src="${e.imgSrc}" alt="">
            </div>
          </div>
          <div class="cell col-4 row">
            <div class="item-name">${e.name}</div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="price">${e.price}</em>
          </div>
          <div class="cell col-1 tc lh70">
            <div class="item-count">
              <a href="javascript:void(0);" class="reduce fl ">-</a>
              <input autocomplete="off" type="text" class="number fl" value="${e.number}">
              <a href="javascript:void(0);" class="add fl">+</a>
            </div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="computed">${e.number * e.price}</em>
          </div>
          <div class="cell col-1">
            <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
          </div>
        </div>
      </div>`  
    })
    $('.item-list').append(jg)
 // 如果arr里面的数据不是全都勾选 需要把 全选的勾选去掉
 let nochall = arr.find(e=>{
     return e.isChecked == false;
 })
 $('.pick-all').prop('checked',!nochall);

    // 把一些应该显示的显示 该隐藏的隐藏
    if(arr.length != 0){
        $('.empty-tip').hide();
        $('.cart-header').show();
        $('.total-of ').show();
    }
//全选和点选
$('.pick-all').on('click',function(){
   let status =  $(this).prop('checked');
   $('.item-ck').prop('checked', status);
   $('.pick-all').prop('checked', status);
   // 把本地数据都勾选 并更新
   arr.forEach(e=>{
       e.isChecked = status;
   })
   // 存入本地数据
  kits.saveData('cartListData',arr)
  // 更新页面的动态数据
     cala();
})
 // 用事件委托 注册单选的点击事件
 // 点选 所有的点选checkbox都是动态生成的，使用委托实现 
 $('.item-list').on('click','.item-ck',function(){
   let dxs = $('.item-ck').length === $('.item-ck:checked').length;
  //  console.log(dxs);
  $('.pick-all').prop('checked', dxs);
  //获取当前行的选中状态 和 id
  let zt = $(this).prop('checked');
  let id = $(this).parents('.item').attr('data-id');
  // 遍历数组 找到对应的ID 数据修改zhuangt
  arr.forEach(e=>{
    if(e.pID == id){
      e.isChecked = zt;
    }
  })
  // 保存到本地
  kits.saveData('cartListData',arr);
  //更新页面
  cala();
  
 })
// 实现数量的加减 
$('.item-list').on('click','.add',function(){
  //  alert(11)
   let prev = $(this).prev();
   let current = prev.val();
  // 每次点击让 输入框里的值++
  prev.val(++current);
  // 找到对ID 在找到数组中对应的id 然后 更改数据
  let id = $(this).parents('.item').attr('data-id');
  // console.log(id);
  let obj = arr.find(e=>{   // find方法查找时返回值 一种是符合条件的对象 一种是没有符合条件时返回underfind
      return e.pID == id;
      })
  obj.number = current;
  // 把数据存到本地
  kits.saveData('cartListData',arr);
  //更新页面 
   cala();
    // 更新右边的价格
    $(this).parents('.item').find('.computed').text(obj.price * obj.number)
})
// 实现点击减号的效果
$('.item-list').on('click','.reduce',function(){
  //  alert(11)
   let next = $(this).next();
   let current = next.val();
  // 每次点击让 输入框里的值--
 if(current <= 1) {
   alert('商品件数不能小于1');
   return;
 }
 next.val(--current);
 // 找到对ID 在找到数组中对应的id 然后 更改数据
 let id = $(this).parents('.item').attr('data-id');
 // console.log(id);
 let obj = arr.find(e=>{   // find方法查找时返回值 一种是符合条件的对象 一种是没有符合条件时返回underfind
     return e.pID == id;
     })
 obj.number = current;
 // 把数据存到本地
 kits.saveData('cartListData',arr);
 //更新页面 
  cala();
   // 更新右边的价格
   $(this).parents('.item').find('.computed').text(obj.price * obj.number)
})
// 给中间的输入框添加获得焦点事件
$('.item-list').on('focus','.number',function(){
  // 先获取 输入框的值 ，并用自定义属性存到这个输入框上
  let old = $(this).val();
  $(this).attr('data-old',old);
})
// 注册失去焦点事件
$('.item-list').on('blur','.number',function(){
  // 获取输入框的值 判断是否合理
  let numberk = $(this).val();
  if(numberk.trim().length == 0 || isNaN(numberk) || parseInt(numberk) <= 0) {
       alert('输入的格式不正确，请重新输入');
       // 在输入不合理的情况下 ，把开始存起来的值 给输入框
       let old = $(this).attr('data-old');
       $(this).val(old);
       return;
  }
 // 获取当前输入框的ID 并且查到对应的本地ID 并且更新
   let id = $(this).parents('.item').attr('data-id');
  //  console.log(id);
   let obj = arr.find(e=>{
        return e.pID == id;
        })
   obj.number = parseInt(numberk);
   // 保存到本地 并且更新页面
   kits.saveData('cartListData',arr);
   cala();
   // 更新右边的价格
   $(this).parents('.item').find('.computed').text(obj.price * obj.number)
})
//按下回车 把输入框的值返回到更新到本地 和 失去焦点是一样的
$('.item-list').on('keyup','.number',function(e){
   if(e.keyCode === 13){
     // 获取输入框的值 判断是否合理
  let numberk = $(this).val();
  if(numberk.trim().length == 0 || isNaN(numberk) || parseInt(numberk) <= 0) {
       alert('输入的格式不正确，请重新输入');
       // 在输入不合理的情况下 ，把开始存起来的值 给输入框
       let old = $(this).attr('data-old');
       $(this).val(old);
       return;
  }
 // 获取当前输入框的ID 并且查到对应的本地ID 并且更新
   let id = $(this).parents('.item').attr('data-id');
  //  console.log(id);
   let obj = arr.find(e=>{
        return e.pID == id;
        })
   obj.number = parseInt(numberk);
   // 保存到本地 并且更新页面
   kits.saveData('cartListData',arr);
   cala();
   // 更新右边的价格
   $(this).parents('.item').find('.computed').text(obj.price * obj.number)
   }
})
//实现删除效果
$('.item-list').on('click','.item-del',function(){
  // alert(11) 
  // 找到 在页面上的id 在找到本地中的ID 删除页面的效果和本地数据
  let id = $(this).parents('.item').attr('data-id');
  // console.log(id); 
  $(this).parents('.item').remove();
  // 用filter把本地的数据删除
  arr = arr.filter(e=>{
   return e.pID != id;
  })
  // 更新本地
  kits.saveData('cartListData',arr);
  // 更新总价
  cala();
  
})

// 更新页面的函数 
cala();
  function cala(){
    let totalCount = 0;
    let totalMoney = 0;
    arr.forEach(e=>{
      if(e.isChecked){
        totalCount += e.number;
        totalMoney += e.number * e.price;
      }
    })
    //把总价和总件数更新到页面里面
    $('.selected').text(totalCount);
    $('.total-money').text(totalMoney);
  }


})