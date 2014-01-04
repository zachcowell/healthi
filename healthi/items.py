from scrapy.item import Item, Field

class HealthiItem(Item):
    title = Field()
    link = Field()
    desc = Field()