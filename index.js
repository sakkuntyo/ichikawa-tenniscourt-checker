const puppeteer = require('puppeteer');
const fs = require('fs');
const { setTimeout } = require('timers/promises');
const tabletojson = require('tabletojson').Tabletojson;
const cheerio = require('cheerio');

(async () => {
	  const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: false
	  });
	  const page = await browser.newPage();
	  await page.goto('https://funayoyaku.city.funabashi.chiba.jp/web/index.jsp');
	//
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.type('input[id="userId"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).userid);
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.type('input[id="password"]',JSON.parse(fs.readFileSync("./settings.json", "utf8")).password);
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.screenshot({path: 'example.png'});
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.click('img[src="image/bw_login.gif"]');
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.click('img[src="image/bw_rsvapply.gif"]');
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.click('img[src="image/bw_fromusepurpose.gif"]');
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await (await page.$x(`//a[text() = "テニス"]`))[0].click();
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await (await page.$x(`//a[text() = "ふなばし三番瀬海浜公園"]`))[0].click();
	  await Promise.all([
		  await setTimeout(1000)
	  ]);
	  
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
	  const arrayvar = [];
	  console.log("hiduke nasi sakujo -------------")
	  data.forEach(item=>{
            //一部空き
            //全て空き
            //予約あり
            //if(item["日曜日"]?.toString().match(/.*予約あり.*/)){
            //  arrayvar.push(item["日曜日"])
	    //}
            //if(item["土曜日"]?.toString().match(/.*予約あり.*/)){
            //  arrayvar.push(item["土曜日"])
            //}
            if(item["日曜日"]?.toString().match(/.*一部空き.*/)){
              arrayvar.push(item["日曜日"])
	    }
            if(item["土曜日"]?.toString().match(/.*一部空き.*/)){
              arrayvar.push(item["土曜日"])
            }
	  })
	  console.dir(arrayvar)
	  console.log("akinomi syutoku -------------")
	  
	  await browser.close();
})();
