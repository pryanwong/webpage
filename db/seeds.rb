# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

company = Company.create(name: 'Demo', licenses: 5, portal: 'Demo_Industrial' )
adminuser = User.create(email: 'sferenci2@gmail.com', role: 3, company_id: company.id, provider: 0)

epm6000json = ' {"product": {"name":"PL6000","basePrice":"1036","options":
          [ {"opname":"Enclosure", "selections":[ {"description":"none", "code":"XXX", "price":"0"},
		                                              {"description":"Single Meter Enclosure 120V","code":"ENC120","price":"800"},
												                          {"description":"Single Meter Enclosure 277V","code":"ENC277","price":"900"} ]},
            {"opname":"Hz","selections":[{"description":"50Hz","code":"5","price":"0"},
			                                   {"description":"60Hz", "code":"6", "price":"0"} ]},
		        {"opname":"THD",  "selections":[{"description":"No THD","code":"0", "price":"0"},
                                            {"description":"THD and KYZ Pulse", "code":"THD", "price":"343"} ]},
            {"opname":"LV Power Supply", "selections":[ {"description":"No LDC",  "code":"0", "price":"0"},
                                                        {"description":"LDC Power Supply", "code":"LDC", "price":"85"}  ]},
            {"opname":"Communications", "selections":[{"description":"Serial","code":"0","price":"0"},
                                                      {"description":"Ethernet","code":"E","price":"260"} ]}]  }}'
puts epm6000json
price1    = Price.create(company_id: company.id, version: 1, name: 'EPM6000', price: epm6000json, product_id: 5)
