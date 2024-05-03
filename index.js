import puppeteer from "puppeteer";

const getQuotes = async () => {


  const browser = await puppeteer.launch({headless:true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}) 
  const page = await browser.newPage()

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
  //console.log(links)
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html', // Prioritize text content
  });
  await page.goto(links[0], { waitUntil: "domcontentloaded" });
  const title = await page.evaluate(() => {
      const title = document.querySelector(".ui-pdp-title").innerText;
      return title;
  });

  console.log(title)






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
  await browser.close();
};

// Start the scraping
getQuotes()
