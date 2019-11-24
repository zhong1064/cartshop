let kits1 = {};
// 下载本地数据
kits1.lodaData = function(key){
    let json = localStorage.getItem(key);
    return JSON.parse(json) || [];
}
//保存数据到本地
kits1.saveData = function(key, data){
     let json = JSON.stringify(data);
     localStorage.setItem(key,json);
}

