from scrapy.spider import BaseSpider
from scrapy.selector import Selector
from healthi.items import HealthiItem

class HealthiSpider(BaseSpider):
	name = "single"
	allowed_domains = ["gegov.com"]
	start_urls = [
		#"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=200360&wguid=1367&wgunm=sysact&wgdmn=431",
		#"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=198305&wguid=1367&wgunm=sysact&wgdmn=431",
		"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=140185&wgdmn=431&wguid=1367&wgunm=sysact"
	]

	def nodeSnag(self,selector, xpathNode, index):
		arr = selector.xpath(xpathNode).extract()
		if index+1 > len(arr):
			return ''
		else:	
			return selector.xpath(xpathNode).extract()[index].strip()

	def parse(self, response):
		sel = Selector(response)
		item = HealthiItem()
		item["response_url"] = response.request.url
		item["establishment_name"] = self.nodeSnag(sel,'//div[@class="container"]/text()',1)
		item["address"] =  self.nodeSnag(sel,'//div[@style="float:left; width:30%;"]/text()',0)
		item["city_state_zip"] =  self.nodeSnag(sel,'//div[@class="container"]/text()',5)
		item["email_address"] =  self.nodeSnag(sel,'//div[@class="container"]/text()',9)
		item["license_customer_number"] =  self.nodeSnag(sel,'//div[@class="container"]/text()',31)
		item["name_of_licensed_trash_or_solid_waste_contractor"] = self.nodeSnag(sel,'//div[@class="container"]/text()',52)
		item["name_of_licensed_liquid_grease_collections_transport_contractor"] = self.nodeSnag(sel,'//div[@class="container"]/text()',53)
		item["name_of_licensed_pest_exterminator_contractor"] = self.nodeSnag(sel,'//div[@class="container"]/text()',54)
		item["establishment_type"] = self.nodeSnag(sel,'//div[@class="container"]/text()',48)
		item["cfpm_number"] = self.nodeSnag(sel,'//div[@class="container"]/text()',51)
		item["certified_food_protection_manager"] = self.nodeSnag(sel,'//div[@class="container"]/text()',49)
		item["cfpm_expiration_date"] = self.nodeSnag(sel,'//span[@style="text-decoration:underline;"]/text()',0)
		item["telephone"] =  self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:28%;"]/text()',0)
		item["date_of_inspection"] =  self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',0) + '/' + self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',1) + '/' + self.nodeSnag(sel,'//div[@class="container"]/div[@style="float:left; width:8%;"]/text()',0)
		item["time_in"] = self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',2) + ':' + self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',3) + self.nodeSnag(sel,'//div[@class="container"]/span/sup/text()',0)
		item["time_out"] = self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',4) + ':' + self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',5) + self.nodeSnag(sel,'//div[@class="container"]/span/sup/text()',1)
		item["license_holder"] =  self.nodeSnag(sel,'//div[@class="container"]//div[@style="float:left; width:30%;"]/text()',1)
		item["risk_category"] = self.nodeSnag(sel,'//div[@style="height:5px;width:5px;background-color:#FF0000;"]//preceding::span[1]/text()',0)		
		item["type_of_inspection"] = self.nodeSnag(sel,'//table[2]//tr[7]//div[last()]/text()',0)
		item["license_period_start"] = self.nodeSnag(sel,'//table[2]//tr[7]//div[2]/text()',0) + '/' + self.nodeSnag(sel,'//table[2]//tr[7]//div[3]/text()',0) + '/' + self.nodeSnag(sel,'//table[2]//tr[7]//div[4]/text()',0)
		item["license_period_end"] = self.nodeSnag(sel,'//table[2]//tr[7]//div[5]/text()',0) + '/' + self.nodeSnag(sel,'//table[2]//tr[7]//div[6]/text()',0) + '/' + self.nodeSnag(sel,'//table[2]//tr[7]//div[7]/text()',0)
		item["critical_violations"] = {}
		item["critical_violations"]["total"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[2]/td[2]/text()',0)
		item["critical_violations"]["cos"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[2]/td[4]/text()',0)
		item["critical_violations"]["r"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[2]/td[6]/text()',0)
		item["noncritical_violations"] = {}
		item["noncritical_violations"]["total"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[3]/td[2]/text()',0)
		item["noncritical_violations"]["cos"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[3]/td[4]/text()',0)
		item["noncritical_violations"]["r"] = self.nodeSnag(sel,'//table[@class="times"][2]/tr[3]/td[6]/text()',0)
		
		return item