import puppeteer from "puppeteer";

const getQuotes = async () => {
  console.log('hola')
  const browser = await puppeteer.launch({executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});

  // Open a new page
  const page = await browser.newPage();

  await page.goto("https://articulo.mercadolibre.com.ar/MLA-707916724-switch-wifi-sonoff-basic-r2-con-funcion-pulso-_JM#is_advertising=true&position=1&search_layout=grid&type=pad&tracking_id=58704d89-55d5-4cd9-bdd7-60531bdf9e90&is_advertising=true&ad_domain=VQCATCORE_LST&ad_position=1&ad_click_id=OWVmMDY5NWUtZTMyYS00NDMwLTg4ZjYtNzAzOWUyMzBjMGQ1", {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"

    const div = document.querySelector(".ui-pdp-component-list");
    const title = div.querySelector(".ui-pdp-title").innerText;

    return { title }; ;
  });

  // Display the quotes
  console.log(quotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();