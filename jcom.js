const puppeteer = require('puppeteer');
const fs = require('fs');
const { setTimeout } = require('timers/promises');
const tabletojson = require('tabletojson').Tabletojson;
const cheerio = require('cheerio');

//line
const axios = require('axios');
const querystring = require('querystring');
const lineNotifyToken = JSON.parse(fs.readFileSync("./settings.json", "utf8")).jcomLineNotifyToken;

(async () => {
  while(true){
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']//,
      //headless: false
    });
    try{
      const page = await browser.newPage();
      // ダイアログにはすべてok
      page.on('dialog',async dialog => {
        dialog.accept();
      })

      // ここからページ操作
      await page.goto('http://reserve.city.ichikawa.lg.jp/');
      await page.waitForFunction(()=> document.readyState === "complete");  
    
      await page.click('input[name="rbtnLogin"]');
      await page.waitForFunction(()=> document.readyState === "complete");
    
      await page.type('input[id="txtID"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).userid);
      await page.waitForFunction(()=> document.readyState === "complete");  

      await page.type('input[id="txtPass"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).password);
      await page.waitForFunction(()=> document.readyState === "complete");  
    
      await page.click('input[value="ログイン >>"]');
      await page.waitForFunction(()=> document.readyState === "complete");  
      
      await page.click('input[value="スポーツ施設"]');
      await page.waitForFunction(()=> document.readyState === "complete");
    
      await page.click('input[value="Ｊ：ＣＯＭ北市川スポーツパーク"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="次へ >>"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="1ヶ月"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="土"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="日"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="祝"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      await page.click('input[value="次へ >>"]');
      await page.waitForFunction(()=> document.readyState === "complete");

      // 不要な行削除
      await page.$$eval('tr[class="TitleColor"]',els => els.forEach(el => el.remove()));
      await page.$$eval('table[id="TableFoot"]',els => els.forEach(el => el.remove()));
      const tabledata = await page.evaluate(() => document.querySelector('table[id*="tpItem_Table1"]').outerHTML)
      const tabledata_json = tabletojson.convert(tabledata,{stripHtmlFromCells:false})[0]
      // コート名
      const courtname = cheerio.load(tabledata_json[0]["0"]).text().trim().trim().replace(/\s.*/g,'')
      // 空き状況
      //console.log(JSON.stringify(tabledata_json[2],null,2))
      // 値の配列
      const valuesArray = []
      Object.values(tabledata_json[2]).forEach(value => {
        if(value.match(/○/) || value.match(/×/) || value.match(/△/)) {
          valuesArray.push(value)
	}
      })
      // 日付とステータス(○☓△)配列
      const dateAndAvailabilityArray = []
      valuesArray.forEach((value) => {
	date = value.replace(/\n/g,"").replace(/.*([0-9]{8}).*/g,"$1")
	availability = value.replace(/\n/g,"").replace(/.*([○×△]).*/g,"$1")
        dateAndAvailabilityArray.push(date + "," + availability)
      })
      // 日付とステータス(○☓△)から△と○のみ抽出した配列
      const akiarray = []
      dateAndAvailabilityArray.forEach((value) => {
        if(value.match(/[○△]/)){
          akiarray.push(value.replace(/.*([0-9]{8}).*/g,"$1"))
	}
      })
      
      // 通知
      if(akiarray.length){
        if(fs.existsSync("/tmp/jcom-court-previous.txt")){
          const previous = fs.readFileSync("/tmp/jcom-court-previous.txt","UTF-8")
          if(previous != JSON.stringify(akiarray)){
            const myLine = new Line();
            myLine.setToken(lineNotifyToken);
            myLine.notify(JSON.stringify(akiarray).toString());
            fs.writeFileSync("/tmp/jcom-court-previous.txt", JSON.stringify(akiarray))
          }
	} else {
          const myLine = new Line();
          myLine.setToken(lineNotifyToken);
          myLine.notify(JSON.stringify(akiarray).toString());
          fs.writeFileSync("/tmp/jcom-court-previous.txt", JSON.stringify(akiarray))
	}
      }
      await browser.close();
      await setTimeout(60000);
    } catch(error) {
      console.log("catched" + error)
      console.error(error)
      await browser.close();
    }
  }
})();

const akisyutoku = async function(page){
  //aki syutoku syori
  //これはできない
  //const tables = await page.evaluate(() => document.querySelectorAll('table[id*="tpItem_Table1"]'))
  //for (const table of tables) {
  //  console.log(table.outerHTML)
  //}
  await page.$eval('table[id="dlRepeat_ctl00_tpItem_Table1"]',el => el.remove());
  const tabledata = await page.evaluate(() => document.querySelector('table[id*="tpItem_Table1"]').outerHTML)
  const tabledata_json = tabletojson.convert(tabledata,{stripHtmlFromCells:false})
  console.log(tabledata_json)
//  const yearmonth = cheerio.load(tabledata_json[0][0]["日曜日"]).text()
//  console.log(yearmonth)
//  tabledata_json[0].shift();
//  console.log("nengetu syutoku -------------")
//  const data = tabledata_json[0].filter(item=>!!item).filter((item)=>{
//    delete item["月曜日"]
//    delete item["火曜日"]
//    delete item["水曜日"]
//    delete item["木曜日"]
//    delete item["金曜日"]
//    return item
//  })
//  console.log("doniti igai sakujo -------------")
//  data.filter(item=>{
//    if(item["土曜日"] == "&nbsp;"){
//      delete item["土曜日"]
//    }
//    if(item["日曜日"] == "&nbsp;"){
//      delete item["日曜日"]
//    }
//  })
//  console.log(data)
//  const akilist = [];
//  console.log("hiduke nasi sakujo -------------")
//  data.forEach(item=>{
//    //一部空き
//    //全て空き
//    //予約あり
//    //if(item["日曜日"]?.toString().match(/.*予約あり.*/)){
//    //  akilist.push(item["日曜日"])
//    //}
//    //if(item["土曜日"]?.toString().match(/.*予約あり.*/)){
//    //  akilist.push(item["土曜日"])
//    //}
//    if(item["日曜日"]?.toString().match(/.*一部空き.*/)){
//      akilist.push(item["日曜日"])
//    }
//    if(item["土曜日"]?.toString().match(/.*一部空き.*/)){
//      akilist.push(item["土曜日"])
//    }
//  })
//  console.log("akinomi syutoku -------------")
//  var akihidukelist = [];
//  akilist.forEach(item=>{
//    console.log("item->" + item)
//    console.log("hiduke syutoku -------------")
//    akihidukelist.push(yearmonth +  cheerio.load(item).text())
//  })
//  */
  return ""
}

const Line = function () {};

/**
 * LINE Notifyのトークンセット
 * @param {String} token LINE Notifyトークン
 */
Line.prototype.setToken = function(token) {
  this.token = token;
}

/**
 * LINE Notify実行
 * @param {String} text メッセージ
 */
Line.prototype.notify = function(text) {
  if(this.token == undefined || this.token == null){
    console.error('undefined token.');
    return;
  }
  console.log(`notify message : ${text}`);
  axios(
    {
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        message: text,
      }),
    }
  )
  .then( function(res) {
    console.log(res.data);
  })
  .catch( function(err) {
    console.error(err);
  });
};
