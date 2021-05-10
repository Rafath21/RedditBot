const fs=require('fs');
const puppy=require('puppeteer');
const say = require('say');
const prompt=require('prompt-sync')();
let processData=process.argv;
let subreddit=processData[2];
let commArr=[];
async function main() {
    let browser = await puppy.launch({
        args:["--disable-popup-blocking","--disable-notifications"],
        headless: false,
        defaultViewport: false,
        ignoreDefaultArgs: ['--enable-automation',
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*']
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://www.reddit.com/r/UpliftingNews/");
    await tab.waitForSelector("#header-search-bar");
    await tab.waitForTimeout(2000)
    console.log("after time")
    await tab.type("#header-search-bar",subreddit);
    await tab.click("#header-search-bar");
    await tab.keyboard.press("Enter")
    await tab.waitForSelector(".ei8_Bq_te0jjwNIqmk8Tw._3MfNPE_vLKliHPkiYMAtZm");
    let suggestions=await tab.$$(".ei8_Bq_te0jjwNIqmk8Tw._3MfNPE_vLKliHPkiYMAtZm");
    await suggestions[0].click();
    await tab.waitForSelector('.SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE',{visible:true});
    let posts=await tab.$$(".SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE");
    console.log(posts.length);
    let postUrls=[];
    let presentUrl='';
     for(let i=0;i<posts.length;i++){
       let url= await tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },posts[i]);
        let postName= await tab.evaluate(function(ele){
        return ele.innerText;
    },posts[i]);
        postUrls.push({
            "postName":postName,
            "postUrl":url
        });
    }
    if(postUrls.length==posts.length){
         fs.writeFileSync("redditPosts.json", JSON.stringify(postUrls));
    }
    console.log(postUrls);
    const index=prompt("Enter the number of the story you want to listen:");
  for(let i=0;i<=index;i++){
            if(i==index){
                say.speak("The entered story's name is:"+postUrls[index].postName);
                presentUrl=postUrls[index].postUrl;
                console.log(postUrls[index].postName);
                break;
            }
     }
     console.log(presentUrl);
     await tab.goto("https://www.reddit.com"+presentUrl);
     await tab.waitForSelector("._1qeIAgB0cPwnLhDF9XSiJM");
     await tab.waitForSelector(".j9NixHqtN2j8SKHcdJ0om._2iuoyPiKHN3kfOoeIQalDT._10BQ7pjWbeYP63SAPNS8Ts.HNozj_dKjQZ59ZsfEegz8._2nelDm85zKKmuD94NequP0");
     await tab.click(".j9NixHqtN2j8SKHcdJ0om._2iuoyPiKHN3kfOoeIQalDT._10BQ7pjWbeYP63SAPNS8Ts.HNozj_dKjQZ59ZsfEegz8._2nelDm85zKKmuD94NequP0");
     let comments=await tab.$$("._1qeIAgB0cPwnLhDF9XSiJM");
     console.log(comments.length);
     for(let i=0;i<comments.length;i++){
       let comment= await tab.evaluate(function(ele){
        return ele.innerText;
    },comments[i]);
    console.log(comment);
    commArr.push(comment);
    if(commArr.length==9){
       let data=commArr.join('');
    fs.writeFileSync("data.txt",data);
    say.speak(data,"Alex");
  }
  }
console.log(commArr);
}

main();
setTimeout(function(){
  say.speak("Hello Rafath!");
  next();
},2000);
const next=function(){
  setTimeout(()=>{
    say.speak("Getting the posts from subreddit:"+subreddit);
  },4000);
}






