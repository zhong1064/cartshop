$(()=>{
  // 第一个功能 先读取本地中的数据，然后动态的生成列表结构
  let arr = kits.loadData('cartListData');
  //遍历数组，生成指定的结构
  let html = '';
  arr.forEach(e=>{
      html += `<div class="item" data-id="${e.pID}">
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
          <div class="item-name">${e.name}}</div>
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
    </div>`;
  })
  $('.item-list').append(html)
  // 如果arr 里面的数据不是全都勾选，需要把全选的勾去掉
  let noCkAll = arr.find(e => {
      return !e.isChecked;
  });
  $('.pick-all').prop('checked',!noCkAll);
  if(arr.length != 0){
    // 处理一些该隐藏的效果和该显示的效果
    $('.empty-tip').hide();
    $('.cart-header').show();
    $('.total-of').show();
  }
  // 全选和点选
  $('.pick-all').on('click',function(){
    let status = $(this).prop('checked');
    $('.item-ck').prop('checked', status);
    $('.pick-all').prop('checked', status);
  //先把本地数据里面的所有数据都勾选
  arr.forEach(e=>{
    e.isChecked = status;
  })
  // 重新存进本地数据
  kits.saveData('cartListData',arr);
  // 点击全选的时候，需要把数据更新
   calcTotal();
  })
  // 点选 所有的点选checkbox都是动态生成的，使用委托实现 
  $('.item-list').on('click', '.item-ck', function(){
    // 如果勾选的个数和总数个数一致 = 全选
    let chall = $('.item-ck').length === $('.item-ck:checked').length
    //设置全选的状态和ckall一致就行
    $('.pick-all').prop('checked',chall);
    //点选的同时，要修改该多选框对应的本地数据里面的选中状态
    // 需要根据点选的id，到本地数据中，修改isChecked属性
    let pID = $(this).parents('.item').attr('data-id');
    // 获取当前这个单选是否选中
    let isChecked = $(this).prop('checked');
    // console.log(pID);
    arr.forEach(e=>{
      if(e.pID == pID){
        //需要把当前这个产品的选中状态改成和勾选状态一致
        e.isChecked = isChecked;
      }
    });
    //把数据更新回本地数据
    kits.saveData('cartListData',arr);
    //每次点选需要更新计算总价和总件数
    calcTotal();
  })
  //封装一个总价格和总件数的函数
  function calcTotal(){
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
  calcTotal();
  //第三个功能 实现数量的加减
  $('.item-list').on('click','.add',function(){
    //让输入框里面的数量增加
    let prev = $(this).prev();
    let current = prev.val();
    prev.val(++current);
    //数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID = id;
    });
    obj.number = current;
   
    //要把数据存储到本地里面才可以
    kits.saveData('cartListData',arr);
    //更新总件数和总价格
    calcTotal();
     //更新右边的总价
     $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })
 //点击减号
 $('.item-list').on('click', '.reduce',function(){
   //让输入框里面的数量减少
   let next = $(this).next();
    let current = next.val();
    //判断一下，当前的值是否 小于等于1 
    if(current <= 1){
      alert('商品的件数不能小于1');
      return;
    }
   next.val(--current);
   //数量也要更新到本地数据
   let id = $(this).parents('.item').attr('data-id');
   let obj = arr.find(e=>{
     return e.pID = id;
   });
   obj.number = current;
  
   //要把数据存储到本地里面才可以
   kits.saveData('cartListData',arr);
   //更新总件数和总价格
   calcTotal();
  //更新右边的总价
  $(this).parents('.item').find('.computed').text(obj.number * obj.price);
 })
 //当得到焦点的时候，把当前的值，先保存起来，如果失焦的时候输入的结果是不合理，我们可以恢复原来的数字
 $('.item-list').on('focus','.number',function(){
   //把旧的，正确的数量先存储起来
   let old = $(this).val();
   $(this).attr('data-old',old);
 });
 //当输入框失去焦点的时候，需要把当前的值也同步到本地数据里面
 $('.item-list').on('blur','.number',function(){
   let current = $(this).val();
   //每次让用户自己输入的内容，一定要做合法性判断
   if (current.trim().length === 0 || isNaN(current) || parseInt(current) <= 0) {
     //如果用户输入不正确 ，恢复以前的正确数字
      let old = $(this).attr('data-old');
       $(this).val(old);
       alert('请输入正确的数字');
       return;      
  }
 
  //如果验证通过，把总价之类的数据更新即可
  // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = parseInt(current);
    //要把数据存储到本地里面才可以
    kits.saveData('cratListData',arr);
    //更新总件数和总价格
   calcTotal();
   //更新右边的总价
   $(this).parents('.item').find('.computed').text(obj.number * obj.price);

 })
  // 当输入框按下回车 把当前的值同步到本地数据
  $('.item-list').on('keyup','.number',function(e){
    if(e.keyCode === 13){
      let current = $(this).val();
   //每次让用户自己输入的内容，一定要做合法性判断
   if (current.trim().length === 0 || isNaN(current) || parseInt(current) <= 0) {
     //如果用户输入不正确 ，恢复以前的正确数字
      let old = $(this).attr('data-old');
       $(this).val(old);
       alert('请输入正确的数字');
       return;      
  }
 
  //如果验证通过，把总价之类的数据更新即可
  // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = parseInt(current);
    //要把数据存储到本地里面才可以
    kits.saveData('cratListData',arr);
    //更新总件数和总价格
   calcTotal();
   //更新右边的总价
   $(this).parents('.item').find('.computed').text(obj.number * obj.price);
    }
  })
  //s实现删除
  $('.item-list').on('click','.item-del',function(){
    layer.confirm('你确定要删除吗？', {icon:0, title: '警告'},(index)=>{
      layer.close(index);
      //在这里执行 删除的逻辑 
      // 先得到要删除的数据的id
      let id = $(this).parents('.item').attr('data-id');
      //把当前点击的这个删除对应的这一行删除
      $(this).parents('.item').remove();
      //把本地存储里面的数据删除
      arr = arr.filter(e=>{
        return e.pID != id;
      });
      //更新本地存储
      kits.saveData('cartListData',arr);
      //重新更新总件数和总价
      calcTotal();
    })
  })
})