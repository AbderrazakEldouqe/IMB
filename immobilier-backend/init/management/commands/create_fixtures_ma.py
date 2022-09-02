import bs4
from urllib.request import urlopen
from bs4 import BeautifulSoup as soup
import params
import os
import io, json
import re

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if os.path.exists("init/fixtures/db_immobiliers_ma_fixture.json"):
            os.remove("init/fixtures/db_immobiliers_ma_fixture.json")

        urls = params.urlsParams
        AllData = []
        id = 0
        filename = "init/fixtures/db_immobiliers_ma_fixture.json"
        f = open(filename, "a+", encoding="utf-8")

        for my_url in urls:

            if my_url["source"] != "marocannonces":
                continue

            # my_url = 'https://www.marocannonces.com/categorie/315/Vente-immobilier/Appartements.html'

            # opening url and grabbing the web page
            uClient = urlopen(my_url["url"])
            page_html = uClient.read()
            uClient.close()

            # html parsing
            page_soup = soup(page_html, "html.parser")

            # grabbing all containers with class name = item-container
            containers = page_soup.findAll("ul", {"class": "cars-list"})
            links = containers[0].select(
                "li a:not([href='boutique/immobilier/tamanarimmo'])"
            )

            for link in links:

                # print(link)
                img_block = link.find("div", {"class": "block_img"})
                holder_block = link.find("div", {"class": "holder"})
                if (img_block) and (holder_block):
                    appartement_link = "https://www.marocannonces.com/" + link["href"]

                    appartement_name = (
                        holder_block.h3.text.strip() if holder_block.h3 else ""
                    )

                    location_div = holder_block.find("span", {"class": "location"})
                    appartement_location = (
                        location_div.text.strip() if location_div else ""
                    )

                    price_div = holder_block.find("strong", {"class": "price"})
                    appartement_price = price_div.text.strip() if price_div else "0"
                    appartement_price = re.sub(r"[^0-9]+", ' ', appartement_price)
                    appartement_price = appartement_price.replace(" ", "")

                    appartement_image = (
                        "https://www.marocannonces.com/"
                        + str((img_block.find("img")).get("data-original")).strip() if (img_block.find("img")).get("data-original") else "http://www.energyfit.com.mk/wp-content/plugins/ap_background/images/default/default_large.png"
                    )

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
