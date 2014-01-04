from scrapy.spider import BaseSpider

class HealthiSpider(BaseSpider):
    name = "healthi"
    allowed_domains = ["dmoz.org"]
    start_urls = [
        "http://www.dmoz.org/Computers/Programming/Languages/Python/Books/",
        "http://www.dmoz.org/Computers/Programming/Languages/Python/Resources/"
    ]

    def parse(self, response):
        filename = response.url.split("/")[-2]
        open(filename, 'wb').write(response.body)

#sel.xpath('//div[@id="uiSearchZip"]').xpath('ul/li/a/@href').extract()
