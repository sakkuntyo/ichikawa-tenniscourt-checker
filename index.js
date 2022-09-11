const puppeteer = require('puppeteer');
const fs = require('fs');
const { setTimeout } = require('timers/promises');
const tabletojson = require('tabletojson').Tabletojson;
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    //headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://funayoyaku.city.funabashi.chiba.jp/web/index.jsp');
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.type('input[id="userId"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).userid);
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.type('input[id="password"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).password);
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.screenshot({path: 'example.png'});
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.click('img[src="image/bw_login.gif"]');
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.click('img[src="image/bw_rsvapply.gif"]');
  await page.waitForFunction(()=> document.readyState === "complete");  

  await page.click('img[src="image/bw_fromusepurpose.gif"]');
  await page.waitForFunction(()=> document.readyState === "complete");  

  await (await page.$x(`//a[text() = "テニス"]`))[0].click();
  await page.waitForFunction(()=> document.readyState === "complete");  

  await (await page.$x(`//a[text() = "ふなばし三番瀬海浜公園"]`))[0].click();
  await page.waitForFunction(()=> document.readyState === "complete");  
  
  //aki syutoku syori
  var akiarray = await akisyutoku(page)

  await page.click('img[alt="次の月"]');
  await page.waitForFunction(()=> document.readyState === "complete");  

  //aki syutoku syori
  akiarray = akiarray.concat(await akisyutoku(page));
  console.log(akiarray)
  
  await browser.close();
})();

const akisyutoku = async function(page){
  //aki syutoku syori
  const tabledata = await page.evaluate(() => document.querySelector('table[class="m_akitablelist"]').outerHTML)
  const tabledata_json = tabletojson.convert(tabledata,{stripHtmlFromCells:false})
  const yearmonth = cheerio.load(tabledata_json[0][0]["日曜日"]).text()
  console.log(yearmonth)
  tabledata_json[0].shift();
  console.log("nengetu syutoku -------------")
  const data = tabledata_json[0].filter(item=>!!item).filter((item)=>{
    delete item["月曜日"]
    delete item["火曜日"]
    delete item["水曜日"]
    delete item["木曜日"]
    delete item["金曜日"]
    return item
  })
  console.log("doniti igai sakujo -------------")
  data.filter(item=>{
    if(item["土曜日"] == "&nbsp;"){
      delete item["土曜日"]
    }
    if(item["日曜日"] == "&nbsp;"){
      delete item["日曜日"]
    }
  })
  console.log(data)
  const akilist = [];
  console.log("hiduke nasi sakujo -------------")
  data.forEach(item=>{
    //一部空き
    //全て空き
    //予約あり
    //if(item["日曜日"]?.toString().match(/.*予約あり.*/)){
    //  akilist.push(item["日曜日"])
    //}
    //if(item["土曜日"]?.toString().match(/.*予約あり.*/)){
    //  akilist.push(item["土曜日"])
    //}
    if(item["日曜日"]?.toString().match(/.*一部空き.*/)){
      arrayvar.push(item["日曜日"])
    }
    if(item["土曜日"]?.toString().match(/.*一部空き.*/)){
      arrayvar.push(item["土曜日"])
    }
  })
  console.log("akinomi syutoku -------------")
  var akihidukelist = [];
  akilist.forEach(item=>{
    console.log("item->" + item)
    console.log("hiduke syutoku -------------")
    akihidukelist.push(yearmonth +  cheerio.load(item).text())
  })
  
  return akihidukelist
}
