# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

company = Company.create(name: 'Demo', licenses: 5, portal: 'Demo_Industrial' )
adminuser = User.create(email: 'sferenci1@gmail.com', role: 3, company_id: company.id, provider: 0)

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

epm2000json = '{"product": { "name":"PL2000", "basePrice":"2000", "options":[]}}'
epm9650json = '{"product": { "name":"PL9650", "basePrice":"3255", "options":[
                             {"opname":"Frequency", "selections":[
                                {"description":"60Hz","code":"0","price":"0"},
                                {"description":"50Hz","code":"1","price":"0"} ]},
                            {"opname":"System Voltage", "selections":[
                                {"description":"120/208 Volts Connection", "code":"A", "price":"0"},
                                {"description":"277/480 Volts Connection", "code":"B", "price":"0"}  ]},
                            {"opname":"Control Power", "selections":[
                                {"description":"90 - 276 AC/DC Volt Supply", "code":"0", "price":"0"},
                                {"description":"90 - 60DC Volt Supply", "code":"1", "price":"0"} ]},
                           {"opname":"Features", "selections":[
                                {"description":"2MB mem, 288 days logging", "code":"A", "price":"0"},
                                {"description":"Flicker, 4MB mem, 96 days logging", "code":"B",   "price":"735"} ]},
                           {"opname":"Communication", "selections":[
                                {"description":"4-ports Modbus/DNP RS485 Serial",   "code":"0", "price":"0"},
                                {"description":"Ethernet 100BaseT",   "code":"1", "price":"584"},
                                {"description":"56K Modem", "code":"2",   "price":"399"} ]},
                           {"opname":"Current Input", "selections":[
                                {"description":"5Amps", "code":"0", "price":"0"},
                                {"description":"1Amp",   "code":"1", "price":"0"} ]}]
               }}'
epm9800json = '{"product": {"name":"PL9800", "basePrice":"4813", "options":[
                     {"opname":"Frequency",   "selections":[
                        {"description":"60Hz", "code":"0", "price":"0"},
                        {"description":"50Hz", "code":"1", "price":"0"} ]},
                     {"opname":"System Voltage", "selections":[
                        {"description":"Blade Powered 102 to 550 VAC", "code":"S", "price":"0"},
                        {"description":"External 102 - 275VAC/DC","code":"E","price":"0"},
                        {"description":"External 18-60VDC", "code":"D", "price":"0"},
                        {"description":"Blade Powered - 69VAC", "code":"L", "price":"0"} ]},
                     {"opname":"Form", "selections":[
                        {"description":"4W Wye Hook-up", "code":"9S", "price":"0"},
                        {"description":"4W Wye with Neutral Hook-up", "code":"36S", "price":"0"},
                        {"description":"3W Delta", "code":"45S", "price":"0"},
                        {"description":"Base Form", "code":"9A", "price":"0"} ]},
                     {"opname":"Logging Options", "selections":[
                        {"description":"218 days logging", "code":"S", "price":"0"},
                        {"description":"688 days logging", "code":"A", "price":"1063"}   ]},
                     {"opname":"Communication", "selections":[
                        {"description":"2-ports Modbus/DNP RS485 Serial", "code":"R", "price":"0"},
                        {"description":"Ethernet 100BaseT", "code":"W", "price":"1081"},
                        {"description":"56K Modem", "code":"M", "price":"618"},
                        {"description":"56K Modem and Ethernet", "code":"C", "price":"1381"} ]},
                     {"opname":"Current Input", "selections":[
                        {"description":"5Amps, Class 20", "code":"20", "price":"0"},
                        {"description":"1Amp, Class 2", "code":"2", "price":"0"}
                     ]}]
               }}'
epm4600json = '{"product": { "name":"PL4600", "basePrice":"2700", "options":[
                     {"opname":"Enclosure", "selections":[
                        {"description":"None", "code":"XXX", "price":"0"},
                        {"description":"Meter Enclosure with 3.5in Display", "code":"ENC350", "price":"2050"},
                        {"description":"Meter Enclosure with 5.7in Display", "code":"ENC570", "price":"2300"} ]},
                     {"opname":"Feed Config", "selections":[
                        {"description":"Single Phase", "code":"S", "price":"0"},
                        {"description":"Three Phase",   "code":"T", "price":"250"} ]},
                     {"opname":"Frequency", "selections":[
                        {"description":"60Hz", "code":"6", "price":"0"},
                        {"description":"50Hz", "code":"5", "price":"0"} ]},
                    {"opname":"Current Input", "selections":[
                        {"description":"10 Amps Max", "code":"10A", "price":"0"},
                        {"description":"2 Amps Max", "code":"02A",  "price":"0"} ]},
                    {"opname":"Software",  "selections":[
                        {"description":"Transducer", "code":"A", "price":"0"},
                        {"description":"Basic Logging, 2MB", "code":"B", "price":"340"},
                        {"description":"Advanced Logging, 32 MB", "code":"C", "price":"600"} ]},
                    {"opname":"Communications",  "selections":[
                        {"description":"Serial (RS485) Modbus", "code":"S", "price":"0"},
                        {"description":"Wifi, RJ45", "code":"W", "price":"370"} ]}]
                }}'
epm9900json = '{"product": { "name":"PL9900", "basePrice":"4750", "options":[
                     {"opname":"Control Power","selections":[
                         {"description":"100 - 240VAC","code":"AC","price":"0"},
								         {"description":"90-265VAC or 100-240VDC","code":"HI","price":"150"},
                         {"description":"18-60VDC (24-48VDC System)","code":"LD", "price":"150"}  	]},
				             {"opname":"Frequency","selections":[
                         {"description":"60Hz",  "code":"6", "price":"0"},
                         {"description":"50Hz","code":"5","price":"0"} ]},
				             {"opname":"Current Input", "selections":[
                                {"description":"5 Amps", "code":"5A", "price":"0"},
                                {"description":"1 Amp", "code":"1A", "price":"0"} ]},
                     {"opname":"Software", "selections":[
                                {"description":"128 MB Memory, 512samples/cycle",  "code":"A", "price":"0"},
                                {"description":"1GB MB Memory, 1024samples/cycle", "code":"B", "price":"1550"},
                                {"description":"1GB MB Memory, 1024samples/cycle, 10MHz recording",  "code":"C",  "price":"4950"} ]},
                     {"opname":"Slot 1", "selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"2-ports RS485 and 4 Pulse Outputs",  "code":"S",  "price":"975"}   ]},
				             {"opname":"Slot 2", "selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"Second Ethernet Port, 100BaseT, RJ45",  "code":"E1",  "price":"550"},
							                	{"description":"Second Ethernet Port, 100BaseFX, ST",  "code":"E2",  "price":"750"} ]},
				             {"opname":"Slot 3", "selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"16 Status Inputs",  "code":"D1",  "price":"725"},
								                {"description":"6 Relay Outputs",  "code":"R1",  "price":"725"} ]},
					           {"opname":"Slot 4", "selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"16 Status Inputs",  "code":"D1",  "price":"725"},
								     {"description":"6 Relay Outputs",  "code":"R1",  "price":"725"} ]}
                    ] } }'
pqmIIjson = '{"product": {   "name":"PQMII", "basePrice":"1203.95", "options":[
                     {"opname":"Transducer","selections":[
                                {"description":"None","code":"XXX","price":"0"},
								                {"description":"4 isolated analog inputs, 20mA","code":"T20","price":"369.05"},
                                {"description":"4 isolated analog inputs, 1mA","code":"T1", "price":"369.05"}  	]},
				             {"opname":"Control Option","selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"3 outputs, 4 inputs","code":"C","price":"272.25"} ]},
					           {"opname":"Analysis Option", "selections":[
                                {"description":"None",  "code":"X", "price":"0"},
                                {"description":"Harmonic Analysis",  "code":"A",  "price":"272.25"} ]}   ]
                         } }'
epm6100json = '{"product": { "name":"PL6100", "basePrice":"595",   "options":[
                               {"opname":"Hz", "selections":[
                                   {"description":"50Hz", "code":"5", "price":"0"},
                                   {"description":"60Hz", "code":"6", "price":"0"} ]},
                               {"opname":"THD", "selections":[
                                   {"description":"No THD", "code":"0",   "price":"0"},
                                   {"description":"THD and KYZ Pulse",   "code":"THD", "price":"125"} ]},
                               {"opname":"Power Supply", "selections":[
                                   {"description":"90-400VAC/100-390VDC", "code":"HI", "price":"0"} ]},
                               {"opname":"Communications", "selections":[
                                   {"description":"Serial", "code":"0", "price":"0"},
                                   {"description":"Ethernet, Wifi or RJ45", "code":"E", "price":"325"}   ]}]
                 }}'
epm7100json = '{"product": { "name":"PL7100", "basePrice":"925", "options":[
                               {"opname":"Hz", "selections":[
                                   {"description":"50Hz", "code":"5", "price":"0"},
                                   {"description":"60Hz", "code":"6", "price":"0"} ]},
                               {"opname":"Software", "selections":[
                                   {"description":"Multifunction meter with logging",   "code":"B", "price":"0"}   ]},
                               {"opname":"Power Supply", "selections":[
                                   {"description":"90-400VAC/100-390VDC",   "code":"HI", "price":"0"}  ]},
                               {"opname":"Communications", "selections":[
                                   {"description":"Serial",   "code":"0",   "price":"0"},
                                   {"description":"Ethernet, Wifi or RJ45",   "code":"E", "price":"325"} ]}]
               }}'
enc350json = '{"product": { "name":"ENC350", "basePrice":"500", "options":[]} }'

puts epm2000json
price1    = Price.create(company_id: company.id, version: 1, name: 'EPM2000', price: epm2000json, product_id: 4)
puts epm6000json
price2    = Price.create(company_id: company.id, version: 1, name: 'EPM6000', price: epm6000json, product_id: 5)
puts epm9650json
price3    = Price.create(company_id: company.id, version: 1, name: 'EPM9650', price: epm9650json, product_id: 6)
puts epm9800json
price4    = Price.create(company_id: company.id, version: 1, name: 'EPM9800', price: epm9800json, product_id: 7)
puts epm4600json
price5    = Price.create(company_id: company.id, version: 1, name: 'EPM4600', price: epm4600json, product_id: 8)
puts epm9900json
price6    = Price.create(company_id: company.id, version: 1, name: 'EPM9900', price: epm9900json, product_id: 9)
puts pqmIIjson
price7    = Price.create(company_id: company.id, version: 1, name: 'PQMII', price: pqmIIjson, product_id: 10)
puts epm6100json
price8    = Price.create(company_id: company.id, version: 1, name: 'EPM6100', price: epm6100json, product_id: 11)
puts epm7100json
price9    = Price.create(company_id: company.id, version: 1, name: 'EPM7100', price: epm7100json, product_id: 12)
puts enc350json
price10    = Price.create(company_id: company.id, version: 1, name: 'ENC350', price: enc350json, product_id: 13)
