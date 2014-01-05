from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import Selector

class HealthiSpider(CrawlSpider):
	name = "healthi"
	allowed_domains = ["gegov.com"]
	start_urls = [
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20001",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20002",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20003",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20004",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20005",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20006",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20007",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20008",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20009",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20010",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20011",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20012",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20013",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20014",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20015",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20016",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20017",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20018",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20019",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20020",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20023",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20024",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20026",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20032",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20036",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20037",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20038",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20045",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20050",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20052",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20057",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20059",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20060",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20064",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20071",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20164",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20165",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20169",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20220",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20240",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20250",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20319",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20340",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20341",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20405",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20407",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20429",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20431",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20433",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20520",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20540",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20543",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20551",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20560",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20565",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20566",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20585",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20590",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20656",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20721",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20724",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20772",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20774",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20785",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20853",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=20904",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=21777",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=22003",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=22079",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=22102",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=22150",
		"http://washington.dc.gegov.com/webadmin/dhd_431/web/?a=inspections&zip=22182"
	]

	rules = (
		Rule(SgmlLinkExtractor(allow=('_paper_food_inspection_report\.cfm', )),callback='parse_item'),
	)

	def parse_item(self, response):
		sel = Selector(response)
		titles = sel.xpath('//title/text()')
		print response.url
		#for r in titles:
		#	print r
