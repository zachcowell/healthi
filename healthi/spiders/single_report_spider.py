from scrapy.spider import BaseSpider
from scrapy.selector import Selector
from healthi.items import HealthiItem

class HealthiSpider(BaseSpider):
	name = "single"
	allowed_domains = ["gegov.com"]
	start_urls = [
		"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=200360&wguid=1367&wgunm=sysact&wgdmn=431",
		"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=198305&wguid=1367&wgunm=sysact&wgdmn=431",
		"http://washington.dc.gegov.com/webadmin/dhd_431/lib/mod/inspection/paper/_paper_food_inspection_report.cfm?inspectionID=140185&wgdmn=431&wguid=1367&wgunm=sysact"
	]

	def get_node_and_trim(self,selector, xpathNode, index):
		arr = selector.xpath(xpathNode).extract()
		if index+1 > len(arr):
			return ''
		else:	
			return selector.xpath(xpathNode).extract()[index].strip()

	def get_compliance_line_items(self,selector):
		base = selector.xpath('//td[@style="width:18px;color:#CC0000;font-weight:bold;text-decoration:underline;"]/..')
		line_items = []
		for idx,x in enumerate(base):
			item = {"line_number" : self.get_node_and_trim(x,'td[@style="width:15px;text-align:right;"]/text()',0), 
					"compliance_status" : self.get_node_and_trim(x,'td[@style="width:18px;color:#CC0000;font-weight:bold;text-decoration:underline;"]/text()',0), 
					"line_item" : self.get_node_and_trim(x,'td[@style=" border-right:1px solid black;width:220px;"]/text()', 0),
					"cos" : x.xpath('td/div')[0].extract().find("#000000") > 0,
					"r" : x.xpath('td/div')[1].extract().find("#000000") > 0 }
			line_items.append(item)
			print item["line_number"] , " ", item["compliance_status"], " ", item["cos"]
		return line_items

	def parse(self, response):
		sel = Selector(response)
		item = HealthiItem()
		item["response_url"] = response.request.url
		item["establishment_name"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',1)
		item["address"] =  self.get_node_and_trim(sel,'//div[@style="float:left; width:30%;"]/text()',0)
		item["city_state_zip"] =  self.get_node_and_trim(sel,'//div[@class="container"]/text()',5)
		item["email_address"] =  self.get_node_and_trim(sel,'//div[@class="container"]/text()',9)
		item["license_customer_number"] =  self.get_node_and_trim(sel,'//div[@class="container"]/text()',31)
		item["name_of_licensed_trash_or_solid_waste_contractor"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',52)
		item["name_of_licensed_liquid_grease_collections_transport_contractor"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',53)
		item["name_of_licensed_pest_exterminator_contractor"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',54)
		item["establishment_type"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',48)
		item["cfpm_number"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',51)
		item["certified_food_protection_manager"] = self.get_node_and_trim(sel,'//div[@class="container"]/text()',49)
		item["cfpm_expiration_date"] = self.get_node_and_trim(sel,'//span[@style="text-decoration:underline;"]/text()',0)
		item["telephone"] =  self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:28%;"]/text()',0)
		item["date_of_inspection"] =  self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',0) + '/' + self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',1) + '/' + self.get_node_and_trim(sel,'//div[@class="container"]/div[@style="float:left; width:8%;"]/text()',0)
		item["time_in"] = self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',2) + ':' + self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',3) + self.get_node_and_trim(sel,'//div[@class="container"]/span/sup/text()',0)
		item["time_out"] = self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',4) + ':' + self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:5%;"]/text()',5) + self.get_node_and_trim(sel,'//div[@class="container"]/span/sup/text()',1)
		item["license_holder"] =  self.get_node_and_trim(sel,'//div[@class="container"]//div[@style="float:left; width:30%;"]/text()',1)
		item["risk_category"] = self.get_node_and_trim(sel,'//div[@style="height:5px;width:5px;background-color:#FF0000;"]//preceding::span[1]/text()',0)		
		item["type_of_inspection"] = self.get_node_and_trim(sel,'//table[2]//tr[7]//div[last()]/text()',0)
		item["license_period_start"] = self.get_node_and_trim(sel,'//table[2]//tr[7]//div[2]/text()',0) + '/' + self.get_node_and_trim(sel,'//table[2]//tr[7]//div[3]/text()',0) + '/' + self.get_node_and_trim(sel,'//table[2]//tr[7]//div[4]/text()',0)
		item["license_period_end"] = self.get_node_and_trim(sel,'//table[2]//tr[7]//div[5]/text()',0) + '/' + self.get_node_and_trim(sel,'//table[2]//tr[7]//div[6]/text()',0) + '/' + self.get_node_and_trim(sel,'//table[2]//tr[7]//div[7]/text()',0)
		item["critical_violations"] = {}
		item["critical_violations"]["total"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[2]/td[2]/text()',0)
		item["critical_violations"]["cos"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[2]/td[4]/text()',0)
		item["critical_violations"]["r"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[2]/td[6]/text()',0)
		item["noncritical_violations"] = {}
		item["noncritical_violations"]["total"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[3]/td[2]/text()',0)
		item["noncritical_violations"]["cos"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[3]/td[4]/text()',0)
		item["noncritical_violations"]["r"] = self.get_node_and_trim(sel,'//table[@class="times"][2]/tr[3]/td[6]/text()',0)
		item["compliance_line_items"] = self.get_compliance_line_items(sel)
		return item