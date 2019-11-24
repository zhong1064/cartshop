$(function(){
//    console.log(location);
//先截取location search里面的id 
 let id = location.search.substring(4);
//  console.log(id);
//用find去查找模拟的数组数据  find 查找时，如果找到结果，返回的就是一个数组元素 没找到时返回一个underfind
 let target =  phoneData.find(e=>{
    return e.pID == id;
})
// 把数据动态渲染到页面中
$('.sku-name').text(target.name);
$('.preview-img > img').attr('src',target.imgSrc)
$('.summary-price em').text(`￥${target.price}`);
//点击加入购物车
$('.addshopcar').on('click',function(){
//获取输入框的值
let number = $('.choose-number').val();
//用户输入的值一般都需要判断，是否符合要求
if(number.trim().length===0 || isNaN(number) || parseInt(number) <= 0){
    alert('输入的值不正确，请正确输入');
    return;
}
//获取本地数据
number = parseInt(number);
let arr = kits.loadData('cartListData');
let fhz = arr.find(e=>{
    e.pID == id;
})
if(fhz){
    e.number += number;

} else {
    let obj ={
        pID : target.pID,
        name: target.name,
        price: target.price,
        imgSrc: target.imgSrc,
        //加上一个默认勾选的
        isChecked: true,    
        number: number  
    }
    arr.push(obj);
    kits.saveData('cartListData',arr);
}
location.href='./cart.html'
})


})