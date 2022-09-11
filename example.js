const puppeteer = require('puppeteer');
const { setTimeout } = require('timers/promises');
const tabletojson = require('tabletojson').Tabletojson;

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

	  await page.type('input[id="userId"]',"")
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  await page.type('input[id="password"]',"")
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

	  console.dir(await(await ((await page.$x(`//a[text() = "ふなばし三番瀬海浜公園"]`))[0]).getProperty('innerHTML')).jsonValue());
	  await (await page.$x(`//a[text() = "ふなばし三番瀬海浜公園"]`))[0].click();
	  await Promise.all([
		  await setTimeout(1000)
	  ]);

	  const tabledata = await page.evaluate(() => document.querySelector('table[class="m_akitablelist"]').outerHTML)
	  console.dir(tabledata);
	  const tabledata_json = tabletojson.convert(tabledata,{stripHtmlFromCells:false})
	  console.dir(tabledata_json)
	  await Promise.all([
		  await setTimeout(1000)
	  ]);
	  
	  await browser.close();
})();
