const filemanager =  document.getElementById('files');
// filemanager.onchange = function(e){
//     console.log(e.target.files)
// }
array = []
filemanager.onchange = function(e){
    console.log(filemanager.files)
    array.push(e.target.files)
    console.log((e.target.files[0].size/1073741824).toFixed(2))

}
