import bs4
from urllib.request import urlopen
from bs4 import BeautifulSoup as soup
import params
import os
import io, json

if os.path.exists("init/fixtures/db_immobiliers.json"):
    os.remove("products.json")
    print("The file has been deleted successfully")

urls = set(params.urlsParams)
AllData = []
filename = "init/fixtures/db_immobiliers.json"
f = open(filename, "a+", encoding="utf-8")

for my_url in urls:
    print(my_url)
    # my_url = 'https://www.marocannonces.com/categorie/315/Vente-immobilier/Appartements.html'

    # opening url and grabbing the web page
    uClient = urlopen(my_url)
    page_html = uClient.read()
    uClient.close()

    # html parsing
    page_soup = soup(page_html, "html.parser")

    # grabbing all containers with class name = item-container
    containers = page_soup.findAll("ul", {"class": "cars-list"})
    links = containers[0].select("li a:not([href='boutique/immobilier/tamanarimmo'])")

    for link in links:

        print(
            "************************************************************************"
        )
        # print(link)
        img_block = link.find("div", {"class": "block_img"})
        holder_block = link.find("div", {"class": "holder"})
        if (img_block) and (holder_block):
            appartement_link = "https://www.marocannonces.com/" + link["href"]
            print(appartement_link)

            appartement_name = holder_block.h3.text.strip() if holder_block.h3 else ""
            print(appartement_name)
            location_div = holder_block.find("span", {"class": "location"})
            appartement_location = location_div.text.strip() if location_div else ""
            print(appartement_location)
            price_div = holder_block.find("strong", {"class": "price"})
            appartement_price = price_div.text.strip() if price_div else ""
            print(appartement_price)

            appartement_image = (
                "https://www.marocannonces.com/"
                + str((img_block.find("img")).get("data-original")).strip()
            )
            print(appartement_image)
            dictionary = {
                "appartement_link": appartement_link,
                "appartement_name": appartement_name,
                "appartement_location": appartement_location,
                "appartement_price": appartement_price,
                "appartement_image": appartement_image,
            }
            AllData.append(dictionary)


f.write(json.dumps(AllData, ensure_ascii=False, indent=4))
f.close()
