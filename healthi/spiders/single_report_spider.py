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
		response = sel.xpath('//div[@class="container"]/text()')
		item = HealthiItem()
		
		item["establishment_name"] = sel.xpath('//div[@class="container"]/text()').extract()[1].strip()
		item["address"] =  sel.xpath('//div[@style="float:left; width:30%;"]/text()').extract()[0].strip()
		item["city_state_zip"] =  sel.xpath('//div[@class="container"]/text()').extract()[5].strip()
		item["email_address"] =  sel.xpath('//div[@class="container"]/text()').extract()[9].strip()
		item["license_customer_number"] =  sel.xpath('//div[@class="container"]/text()').extract()[31].strip()
		item["name_of_licensed_trash_or_solid_waste_contractor"] = sel.xpath('//div[@class="container"]/text()').extract()[52].strip()
		item["name_of_licensed_liquid_grease_collections_transport_contractor"] = sel.xpath('//div[@class="container"]/text()').extract()[53].strip()
		item["name_of_licensed_pest_exterminator_contractor"] = sel.xpath('//div[@class="container"]/text()').extract()[54].strip()
		item["establishment_type"] = sel.xpath('//div[@class="container"]/text()').extract()[48].strip()
		item["cfpm_number"] = sel.xpath('//div[@class="container"]/text()').extract()[51].strip()
		item["certified_food_protection_manager"] = sel.xpath('//div[@class="container"]/text()').extract()[49].strip()
		item["cfpm_expiration_date"] = sel.xpath('//span[@style="text-decoration:underline;"]/text()').extract()[0].strip()
		item["telephone"] =  sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:28%;"]/text()')[0].extract().strip()
		item["date_of_inspection"] =  sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[0].extract().strip() + '/' + sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[1].extract().strip() + '/' + sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:8%;"]/text()')[0].extract().strip()
		item["time_in"] = sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[2].extract().strip() + ':' + sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[3].extract().strip() + sel.xpath('//div[@class="container"]').xpath('span/sup/text()')[0].extract().strip()
		item["time_out"] = sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[4].extract().strip() + ':' + sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:5%;"]/text()')[5].extract().strip() + sel.xpath('//div[@class="container"]').xpath('span/sup/text()')[1].extract().strip()
		item["license_holder"] =  sel.xpath('//div[@class="container"]').xpath('div[@style="float:left; width:30%;"]/text()')[1].extract().strip()
		item["risk_category"] = sel.xpath('//div[@style="height:5px;width:5px;background-color:#FF0000;"]').xpath('preceding::span[1]/text()').extract()[0].strip()		
		item["type_of_inspection"] = sel.xpath('//table[2]//tr[7]//div[last()]/text()')[0].extract().strip()
		item["license_period_start"] = sel.xpath('//table[2]//tr[7]//div[2]/text()')[0].extract().strip() + '/' + sel.xpath('//table[2]//tr[7]//div[3]/text()')[0].extract().strip() + '/' + sel.xpath('//table[2]//tr[7]//div[4]/text()')[0].extract().strip()
		item["license_period_end"] = sel.xpath('//table[2]//tr[7]//div[5]/text()')[0].extract().strip() + '/' + sel.xpath('//table[2]//tr[7]//div[6]/text()')[0].extract().strip() + '/' + sel.xpath('//table[2]//tr[7]//div[7]/text()')[0].extract().strip()

		return item