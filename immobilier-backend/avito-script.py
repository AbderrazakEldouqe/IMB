import bs4
from urllib.request import urlopen
from bs4 import BeautifulSoup as soup
import params
import os
import io, json
import requests
import re

from requests_html import HTMLSession
from fake_useragent import UserAgent

if os.path.exists("init/fixtures/db_immobiliers_avito_fixture.json"):
    os.remove("init/fixtures/db_immobiliers_avito_fixture.json")

urls = params.urlsParams
AllData = []
id = 0
filename = "init/fixtures/db_immobiliers_avito_fixture.json"
f = open(filename, "a+", encoding="utf-8")

for my_url in urls:

    # my_url = 'https://www.marocannonces.com/categorie/315/Vente-immobilier/Appartements.html'

    # opening url and grabbing the web page
    print(my_url["url"])
    # uClient = urlopen(my_url["url"])
    session = HTMLSession()
    rs = session.get(my_url["url"])
    rs.html.render(sleep=3)
    page_soup = soup(rs.html.raw_html, "html.parser")
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
