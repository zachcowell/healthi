from scrapy.spider import BaseSpider
from scrapy.selector import Selector
from healthi.items import HealthiItem

class HealthiSpider(BaseSpider):
	name = "single"
	allowed_domains = ["gegov.com"]
	start_urls = [
		"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=200360&wguid=1367&wgunm=sysact&wgdmn=431"
	]

	def parse(self, response):
		sel = Selector(response)
		response = sel.xpath('//div[@class="container"][2][4]/text()')
		item = HealthiItem()
		
		item["establishment_name"] = sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["address"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["city_state_zip"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["telephone"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["date_of_inspection"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["license_holder"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["license_period"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["establishment_type"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["risk_category"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["type_of_inspection"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["license_customer_number"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["time_in"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["time_out"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["email_address"] =  sel.xpath('//div[@class="container"]/text()').extract()[1].strip()

		return item