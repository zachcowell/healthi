from scrapy.spider import BaseSpider
from scrapy.selector import Selector

class HealthiSpider(BaseSpider):
    name = "healthi"
    allowed_domains = ["gegov.com"]
    start_urls = [
        "http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=Inspections"
    ]

    def parse(self, response):
    	base = "http://washington.dc.gegov.com/webadmin/dhd_431/web/"
        sel = Selector(response)
        sites = sel.xpath('//div[@id="uiSearchZip"]').xpath('ul/li/a/@href').extract()

        for zip in sites:
        	print base + zip
    	
#sel.xpath('//div[@id="uiSearchZip"]').xpath('ul/li/a/@href').extract()
