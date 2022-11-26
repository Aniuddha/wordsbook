// const fs = require('fs');



const testFolder = './';
const fs = require('fs');
var pages=[]
var exculde;

//Reading Excluded words
function excludeWords() {
fs.readFile('./exclude-words.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  exculde = data.split(/\r?\n/);
  console.log("Exculding Words Read")
});}
excludeWords();

//reading total pages staring filename with "Page"
function totalpages() {
fs.readdirSync(testFolder).forEach(file => {
  if ((file.slice(0,4)) =='Page'){
  pages.push(file.slice(4,5))
  }
});
//console.log(pages)
}
totalpages()

//reading each page
function readingpages(){
var predata=[]
var pagenumber=[]
pages.forEach(number=>{
  fs.readFile(`Page${number}.txt`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    data = data.replace(/[^a-zA-Z0-9 ]/g, '');
    var splitArr = data.split(/\W+/);
    var removed =[]
    for(var i =0;i<splitArr.length;i++){
      if(!isNaN(splitArr[i])){
        removed.push(splitArr.splice(i, 1));
      }
      else{
        var matches = splitArr[i].match(/(\d+)/);
        if (matches) {
          splitArr[i]=splitArr[i].replace(matches[0],'');
         }
      }
    }

  console.log("Page" ,number,"Read")
  // console.log(splitArr);
  // console.log(removed);
  removed=[]

//removing duplicate
  function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
    }
  splitArr=removeDuplicates(splitArr);
  // console.log(splitArr);
  
  setTimeout(function(){
  for(var i=0;i<splitArr.length;i++){
    for(var j=0;j<exculde.length;j++){
       if(exculde[j].toLowerCase() === splitArr[i].toLowerCase()){
        splitArr.splice(i, 1);
       }
    }
  }
}, 100);
  predata.push(splitArr)
  pagenumber.push(number)
  });
})
return [predata,pagenumber]

}


var [predata,number]=readingpages();

var obj=[]

//seeting a timeout to preprocess the data
setTimeout(function(){
  //console.log(predata)
  //console.log(number)
  console.log("Processing...")

  for (var i=0;i<predata.length;i++){
         
      for(var j=0;j<predata[i].length;j++){
        obj.push([predata[i][j],number[i]])
        
      }      
    }
  obj.sort()
}, 3000);

//setting a timeout for removing duplicate data
setTimeout(function(){
  var processed=[]
  for(var i=0;i<obj.length;i++){
    var temp=[]
    for(var j=i;j<obj.length;j++){
      
      if(obj[i][0]==obj[j][0]){
        temp.push(obj[j][1])
      }else{
        processed.push([obj[i][0],temp])
        i=j-1
        break;
      }
    }
  }
  //console.log(processed)
  console.log("Processing finsihed")
  var final={}
for(var i=0;i<processed.length;i++){
  final[processed[i][0]]=processed[i][1]
}

const myJSON = JSON.stringify(final);

 fs.writeFileSync('Output.txt',myJSON,{encoding:'utf8',flag:'w'})
 console.log("File created")
}, 5000);
  
