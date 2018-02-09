function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: false,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, (tabs) => {//tabs is an object of all tabs except the current tab.. see documentation of how to include current tab
        var tab_all=tabs;
        callback(tab_all);
    });
}

function refreshList(){
    chrome.storage.sync.get(null,(item) => {
        var str='';
        var list=document.getElementById('dropdown')
        var del_list=document.getElementById('dropdown_del')
        for(var key in item){
            if(item.hasOwnProperty(key)){
                var title=item[key].title;
                var wid=key
                str+="<option value="+wid+" class='opclick' style='background:white;height: 20px;color:black;padding:20px !important;margin:20px'>"+title+"</option>";
            }
        }
        list.innerHTML="<option selected disabled hidden value='Open Tab Group'>Open Tab Group</option>"+str;
        del_list.innerHTML="<option selected disabled hidden value='Delete Tab Group'>Delete Tab Group</option>"+str;
    });
}

document.getElementById("dropdown").onchange=openTabGroup;
function openTabGroup(){
    var vali=document.getElementById("dropdown").value;
    chrome.storage.sync.get(vali,(item)=>{
        var list=[];
        var tablist=item[vali]
        for(var key in tablist){
            list.push(tablist[key]['url'])
        }
        list.pop();
        chrome.windows.create({url:list});
    })
}

document.getElementById("dropdown_del").onchange=deleteTabGroup;
function deleteTabGroup(){
    var vali=document.getElementById("dropdown_del").value;
    var val=21;
    chrome.storage.sync.remove(vali,function(){
        console.log("removed it bitch");
        console.log(val);/*this displays 21..So the access of a variable in any enclosing parent is available inside callback.. right? */
        refreshList();
    })
}

function saveTabGroup(tab_all,val) {
    var item={};
    for(var i=0;i<tab_all.length;i=i+1){
       item[i]={};
       item[i]['url']=tab_all[i]['url'];
       item[i]['windowid']=tab_all[i]['windowId'];
    }
    item['title']=val;
    var wid=tab_all[0].windowId;
    var tab_col={};
    tab_col[wid]=item;
    chrome.storage.sync.set(tab_col);
    refreshList();
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((tab_all) => {
        tab_all1=tab_all;
        var dropdown = document.getElementById('dropdown');
        var btn=document.getElementById('enterTitle');
        var inbox=document.getElementById('title');
        btn.onclick=function(e){
            var val=inbox.value;
            saveTabGroup(tab_all1,val);
        }
        refreshList()
    });
});

// function getSavedBackgroundColor(key,callback) {
//     var key1=179;
//     console.log("in get")
//     console.log(key1)
//     chrome.storage.sync.get(null,(item) => {
//         console.log("in sync")
//     console.log(item)
//     console.log("above callback")
//     callback(key1,item);/**why is key 1 still accessible inside this..asynchronous function therefore key 1 must have been destroyed by now**/
// });
// }

// getSavedBackgroundColor(179,(key,item) => {
//     console.log("in callback")
// console.log(key)
//     console.log(item[key]);
// });