import puppeteer from "puppeteer";
import { performance } from "perf_hooks";
import { get } from "http";
import log from "node-gyp/lib/log";

const getQuotes = async () => {
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

  async function getLinks(selector) {
    const links = await page.evaluate(() => {
      const items = document.querySelectorAll(selector);
      const links = [];
      items.forEach((item) => {
        const link = item.href;
        links.push(link);
      });
      return links;
    });
  
    return links;
  }

  let pages = getLinks(".andes-pagination__link")
  console.log(pages)

  for (const page of pages) {
    
    await page.goto(page, { waitUntil: "domcontentloaded" });  
    let links = getLinks(".ui-search-link__title-card").filter(item => !item.includes('click1'))
    for (const link of links) {
      try {
          await page.goto(link, { waitUntil: "domcontentloaded" });
          const details = await page.evaluate(() => {
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
  }
  
  await page.close();
  await browser.close();
  
}


getQuotes()
