from scrapy.item import Item, Field

class HealthiItem(Item):
    establishment_name = Field()
    address = Field()
    city_state_zip = Field()
    telephone = Field()
    date_of_inspection = Field()
    license_holder = Field()
    license_period = Field()
    establishment_type = Field()
    risk_category = Field()
    type_of_inspection = Field()
    license_customer_number = Field()
    time_in = Field()
    time_out = Field()
    email_address = Field()