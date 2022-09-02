import bs4
from urllib.request import urlopen
from bs4 import BeautifulSoup as soup
import params
import os
import io, json
import requests
import re

import asyncio
from pyppeteer import launch

from requests_html import HTMLSession
from fake_useragent import UserAgent

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    

    def handle(self, *args, **kwargs):

        async def myfun(linkUrl):
            # launch chromium browser in the background
            # browser = await launch({"headless": False, "args": ["--start-maximized"], "autoClose": False})
            browser = await launch(executablePath='/usr/bin/google-chrome-stable', headless=True, args=['--no-sandbox'])

            # open a new tab in the browser
            page = await browser.newPage()
            # add URL to a new page and then open it
            await page.goto(linkUrl)
            # create a screenshot of the page and save it
            await asyncio.sleep(2)
            # await page.waitFor(1000)
            x = await page.content()
            # with open("sample.html", "w", encoding="utf-8") as f:
            #     f.write(x)
            #     file.close()
            # close the browser
            await browser.close()
            return x

        if os.path.exists("init/fixtures/db_immobiliers_avito_fixture.json"):
            os.remove("init/fixtures/db_immobiliers_avito_fixture.json")

        urls = params.urlsParams
        AllData = []
        id = 0
        filename = "init/fixtures/db_immobiliers_avito_fixture.json"
        f = open(filename, "a+", encoding="utf-8")

        for my_url in urls:
            if my_url["source"] != "avito":
                continue

            # my_url = 'https://www.marocannonces.com/categorie/315/Vente-immobilier/Appartements.html'

            # opening url and grabbing the web page
            print(my_url["url"])
            # uClient = urlopen(my_url["url"])

            # browser = await launch({"headless": False, "args": ["--start-maximized"]})
            # page = await browser.newPage()
            # options = {"waitUntil": 'load', "timeout": 0}
            # await page.goto(my_url["url"], options=options)
            # await page.waitFor(1000)
            # htmldd = await page.content()
            # await browser.close()
            htmldd =  asyncio.run(myfun(my_url["url"]))
            print(htmldd)
            page_soup = soup(htmldd, "html.parser")
            
            # session = HTMLSession()
            # rs = session.get(my_url["url"])
            # rs.html.render({"pyppeteer_args":{"executablePath":"/usr/bin/google-chrome-stable"}})
            # page_soup = soup(rs.html.raw_html, "html.parser")
            # page_html = uClient.read()
            # uClient.close()

            # html parsing
            # page_soup = soup(uClient, "html.parser")

            # grabbing all containers with class name = item-container
            containers = page_soup.findAll("div", {"class": "sc-1nre5ec-0 dBrweF listing"})
            links = containers[0].select("div a")
            # print(links)
            for link in links:

                # print(link)
                img_block = link.select(
                    "div.oan6tk-3 > div.oan6tk-2 > img"
                )
                appartement_image = str((img_block[0]).get("src")).strip() if (img_block[0]).get("src") else "http://www.energyfit.com.mk/wp-content/plugins/ap_background/images/default/default_large.png"
                
                if len(appartement_image)>0 and appartement_image[0]=="/":
                    appartement_image = "http://www.energyfit.com.mk/wp-content/plugins/ap_background/images/default/default_large.png"
                
                holder_block = link.find(
                    "div",{"class": "oan6tk-4"}
                )

                appartement_price = holder_block.contents[0].div.span.span.text.strip() if holder_block.contents[0].div.span.span else "0"
                appartement_price = re.sub(r"[^0-9]+", "", appartement_price)
                appartement_price = appartement_price.replace(" ", "")
                # print(len(appartement_price))

                appartement_name = holder_block.contents[0].h3.span.text.strip() if holder_block.contents[0].h3.span else ""
            

                appartement_link = link["href"]
                appartement_location = holder_block.contents[1].select("div.oan6tk-10 > div.oan6tk-11")[1].span.text.strip() if holder_block.contents[1].select("div.oan6tk-10 > div.oan6tk-11")[1].span else ""
                #print(appartement_location)
                

                id += 1

                dictionary = {
                    "model": "immobilier.immobilier",
                    "id": str(id),
                    "fields": {
                        "url": appartement_link,
                        "title": appartement_name,
                        "city": appartement_location,
                        "price": float(appartement_price),
                        "thumbnail_url": appartement_image,
                        "type": my_url["type"],
                        "transaction": my_url["transaction"],
                        "source": my_url["source"],
                    },
                }
                AllData.append(dictionary)

        f.write(json.dumps(AllData, ensure_ascii=False, indent=4))
        f.close()



