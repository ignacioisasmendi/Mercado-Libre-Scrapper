import puppeteer from "puppeteer";
import { performance } from "perf_hooks";

const getQuotes = async () => {
  //const startTime = performance.now();
  const browser = await puppeteer.launch({headless:true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}) 
  const page = await browser.newPage()
  await page.setRequestInterception(true);

  page.on('request', (req) => {
  if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
        req.abort();
    }
    else {
        req.continue();
    }
  });

  await page.goto('https://listado.mercadolibre.com.ar/sonoff#D[A:sonoff]', {
    waitUntil: "domcontentloaded",
  })

  const items = await page.evaluate(() => {
    const items = document.querySelectorAll(".ui-search-link__title-card")
    const links = [] 
    items.forEach(item => {
      const link = item.href
      links.push(link)
    })
    return links
  })

   let links = items.filter(item => !item.includes('click1'))
 
 /*  await page.goto(links[0], { waitUntil: "domcontentloaded" });
  const title = await page.evaluate(() => {
      const title = document.querySelector(".ui-pdp-title").innerText;
      return title;
  });
 */

  for (const link of links) {
    try {
        await page.goto(link, { waitUntil: "domcontentloaded" });
        const details = await page.evaluate(() => {
           // const div = document.querySelector(".ui-pdp-component-list");
            const title = document.querySelector(".ui-pdp-title").innerText;
            let sales = document.querySelector(".ui-pdp-subtitle").innerText;
            sales = sales.match(/\d+/)[0];
            let price = document.querySelector(".andes-money-amount__fraction").innerText;
            return { title, sales, price };
        });
        console.log(details);
    } catch (error) {
        console.error("Error navigating to URL:", link);
        console.error(error);
    }
  }

 // await page.close();
  await browser.close();

  const endTime = performance.now();
  //console.log(`Execution time: ${Math.floor(endTime - startTime)} ms`);
  
}


getQuotes()




 /*
    for (const link of links) {
      try {
          await page.goto(link, { waitUntil: "domcontentloaded" });
          const details = await page.evaluate(() => {
              const div = document.querySelector(".ui-pdp-component-list");
              const title = div.querySelector(".ui-pdp-title").innerText;
              let sales = div.querySelector(".ui-pdp-subtitle").innerText;
              sales = sales.match(/\d+/)[0];
              let price = div.querySelector(".andes-money-amount__fraction").innerText;
              return { title, sales, price };
          });
          console.log(details);
      } catch (error) {
          console.error("Error navigating to URL:", link);
          console.error(error);
      }
    }
  */