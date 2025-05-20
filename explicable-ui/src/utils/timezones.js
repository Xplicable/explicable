const timezones = [
  {
    value: "Dateline Standard Time",
    text: "(UTC-12:00) International Date Line West",
    iana: "Etc/GMT+12",
    offset: -12,
    isdst: false,
    abbr: "DST"
  },
  {
    value: "UTC-11",
    text: "(UTC-11:00) Coordinated Universal Time-11",
    iana: "Pacific/Midway",
    offset: -11,
    isdst: false,
    abbr: "U"
  },
  {
    value: "Hawaiian Standard Time",
    text: "(UTC-10:00) Hawaii",
    iana: "Pacific/Honolulu",
    offset: -10,
    isdst: false,
    abbr: "HST"
  },
  {
    value: "Alaskan Standard Time",
    text: "(UTC-09:00) Alaska",
    iana: "America/Anchorage",
    offset: -8,
    isdst: true,
    abbr: "AKDT"
  },
  {
    value: "Pacific Standard Time (Mexico)",
    text: "(UTC-08:00) Baja California",
    iana: "America/Santa_Isabel",
    offset: -7,
    isdst: true,
    abbr: "PDT"
  },
  {
    value: "Pacific Standard Time",
    text: "(UTC-08:00) Pacific Time (US & Canada)",
    iana: "America/Los_Angeles",
    offset: -7,
    isdst: true,
    abbr: "PDT"
  },
  {
    value: "US Mountain Standard Time",
    text: "(UTC-07:00) Arizona",
    iana: "America/Phoenix",
    offset: -7,
    isdst: false,
    abbr: "UMST"
  },
  {
    value: "Mountain Standard Time (Mexico)",
    text: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
    iana: "America/Chihuahua",
    offset: -6,
    isdst: true,
    abbr: "MDT"
  },
  {
    value: "Mountain Standard Time",
    text: "(UTC-07:00) Mountain Time (US & Canada)",
    iana: "America/Denver",
    offset: -6,
    isdst: true,
    abbr: "MDT"
  },
  {
    value: "Central America Standard Time",
    text: "(UTC-06:00) Central America",
    iana: "America/Guatemala",
    offset: -6,
    isdst: false,
    abbr: "CAST"
  },
  {
    value: "Central Standard Time",
    text: "(UTC-06:00) Central Time (US & Canada)",
    iana: "America/Chicago",
    offset: -5,
    isdst: true,
    abbr: "CDT"
  },
  {
    value: "Central Standard Time (Mexico)",
    text: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
    iana: "America/Mexico_City",
    offset: -5,
    isdst: true,
    abbr: "CDT"
  },
  {
    value: "Canada Central Standard Time",
    text: "(UTC-06:00) Saskatchewan",
    iana: "America/Regina",
    offset: -6,
    isdst: false,
    abbr: "CCST"
  },
  {
    value: "SA Pacific Standard Time",
    text: "(UTC-05:00) Bogota, Lima, Quito",
    iana: "America/Bogota",
    offset: -5,
    isdst: false,
    abbr: "SPST"
  },
  {
    value: "Eastern Standard Time",
    text: "(UTC-05:00) Eastern Time (US & Canada)",
    iana: "America/New_York",
    offset: -4,
    isdst: true,
    abbr: "EDT"
  },
  {
    value: "US Eastern Standard Time",
    text: "(UTC-05:00) Indiana (East)",
    iana: "America/Indianapolis",
    offset: -4,
    isdst: true,
    abbr: "UEDT"
  },
  {
    value: "Venezuela Standard Time",
    text: "(UTC-04:30) Caracas",
    iana: "America/Caracas",
    offset: -4.5,
    isdst: false,
    abbr: "VST"
  },
  {
    value: "Paraguay Standard Time",
    text: "(UTC-04:00) Asuncion",
    iana: "America/Asuncion",
    offset: -4,
    isdst: false,
    abbr: "PST"
  },
  {
    value: "Atlantic Standard Time",
    text: "(UTC-04:00) Atlantic Time (Canada)",
    iana: "America/Halifax",
    offset: -3,
    isdst: true,
    abbr: "ADT"
  },
  {
    value: "Central Brazilian Standard Time",
    text: "(UTC-04:00) Cuiaba",
    iana: "America/Cuiaba",
    offset: -4,
    isdst: false,
    abbr: "CBST"
  },
  {
    value: "SA Western Standard Time",
    text: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
    iana: "America/La_Paz",
    offset: -4,
    isdst: false,
    abbr: "SWST"
  },
  {
    value: "Pacific SA Standard Time",
    text: "(UTC-04:00) Santiago",
    iana: "America/Santiago",
    offset: -4,
    isdst: false,
    abbr: "PSST"
  },
  {
    value: "Newfoundland Standard Time",
    text: "(UTC-03:30) Newfoundland",
    iana: "America/St_Johns",
    offset: -2.5,
    isdst: true,
    abbr: "NDT"
  },
  {
    value: "E. South America Standard Time",
    text: "(UTC-03:00) Brasilia",
    iana: "America/Sao_Paulo",
    offset: -3,
    isdst: false,
    abbr: "ESAST"
  },
  {
    value: "Argentina Standard Time",
    text: "(UTC-03:00) Buenos Aires",
    iana: "America/Argentina/Buenos_Aires",
    offset: -3,
    isdst: false,
    abbr: "AST"
  },
  {
    value: "SA Eastern Standard Time",
    text: "(UTC-03:00) Cayenne, Fortaleza",
    iana: "America/Fortaleza",
    offset: -3,
    isdst: false,
    abbr: "SEST"
  },
  {
    value: "Greenland Standard Time",
    text: "(UTC-03:00) Greenland",
    iana: "America/Godthab",
    offset: -2,
    isdst: true,
    abbr: "GDT"
  },
  {
    value: "Montevideo Standard Time",
    text: "(UTC-03:00) Montevideo",
    iana: "America/Montevideo",
    offset: -3,
    isdst: false,
    abbr: "MST"
  },
  {
    value: "Bahia Standard Time",
    text: "(UTC-03:00) Salvador",
    iana: "America/Bahia",
    offset: -3,
    isdst: false,
    abbr: "BST"
  },
  {
    value: "UTC-02",
    text: "(UTC-02:00) Coordinated Universal Time-02",
    iana: "Etc/GMT+2",
    offset: -2,
    isdst: false,
    abbr: "U"
  },
  {
    value: "Mid-Atlantic Standard Time",
    text: "(UTC-02:00) Mid-Atlantic - Old",
    iana: "America/Noronha",
    offset: -1,
    isdst: true,
    abbr: "MDT"
  },
  {
    value: "Azores Standard Time",
    text: "(UTC-01:00) Azores",
    iana: "Atlantic/Azores",
    offset: 0,
    isdst: true,
    abbr: "ADT"
  },
  {
    value: "Cape Verde Standard Time",
    text: "(UTC-01:00) Cape Verde Is.",
    iana: "Atlantic/Cape_Verde",
    offset: -1,
    isdst: false,
    abbr: "CVST"
  },
  {
    value: "Morocco Standard Time",
    text: "(UTC) Casablanca",
    iana: "Africa/Casablanca",
    offset: 1,
    isdst: true,
    abbr: "MDT"
  },
  {
    value: "UTC",
    text: "(UTC) Coordinated Universal Time",
    iana: "Etc/UTC",
    offset: 0,
    isdst: false,
    abbr: "CUT"
  },
  {
    value: "GMT Standard Time",
    text: "(UTC) Dublin, Edinburgh, Lisbon, London",
    iana: "Europe/London",
    offset: 1,
    isdst: true,
    abbr: "GDT"
  },
  {
    value: "Greenwich Standard Time",
    text: "(UTC) Monrovia, Reykjavik",
    iana: "Atlantic/Reykjavik",
    offset: 0,
    isdst: false,
    abbr: "GST"
  },
  {
    value: "W. Europe Standard Time",
    text: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    iana: "Europe/Berlin",
    offset: 2,
    isdst: true,
    abbr: "WEDT"
  },
  {
    value: "Central Europe Standard Time",
    text: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    iana: "Europe/Budapest",
    offset: 2,
    isdst: true,
    abbr: "CEDT"
  },
  {
    value: "Romance Standard Time",
    text: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
    iana: "Europe/Paris",
    offset: 2,
    isdst: true,
    abbr: "RDT"
  },
{
    value: "Central European Standard Time",
    text: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
    iana: "Europe/Warsaw",
    offset: 2,
    isdst: true,
    abbr: "CEDT"
  },
  {
    value: "W. Central Africa Standard Time",
    text: "(UTC+01:00) West Central Africa",
    iana: "Africa/Lagos",
    offset: 1,
    isdst: false,
    abbr: "WCAST"
  },
  {
    value: "Namibia Standard Time",
    text: "(UTC+01:00) Windhoek",
    iana: "Africa/Windhoek",
    offset: 1,
    isdst: false,
    abbr: "NST"
  },
  {
    value: "GTB Standard Time",
    text: "(UTC+02:00) Athens, Bucharest",
    iana: "Europe/Athens",
    offset: 3,
    isdst: true,
    abbr: "GDT"
  },
  {
    value: "Middle East Standard Time",
    text: "(UTC+02:00) Beirut",
    iana: "Asia/Beirut",
    offset: 3,
    isdst: true,
    abbr: "MEDT"
  },
  {
    value: "Egypt Standard Time",
    text: "(UTC+02:00) Cairo",
    iana: "Africa/Cairo",
    offset: 2,
    isdst: false,
    abbr: "EST"
  },
  {
    value: "Syria Standard Time",
    text: "(UTC+02:00) Damascus",
    iana: "Asia/Damascus",
    offset: 3,
    isdst: true,
    abbr: "SDT"
  },
  {
    value: "E. Europe Standard Time",
    text: "(UTC+02:00) E. Europe",
    iana: "Europe/Bucharest",
    offset: 3,
    isdst: true,
    abbr: "EEDT"
  },
  {
    value: "South Africa Standard Time",
    text: "(UTC+02:00) Harare, Pretoria",
    iana: "Africa/Johannesburg",
    offset: 2,
    isdst: false,
    abbr: "SAST"
  },
  {
    value: "FLE Standard Time",
    text: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    iana: "Europe/Helsinki",
    offset: 3,
    isdst: true,
    abbr: "FDT"
  },
  {
    value: "Turkey Standard Time",
    text: "(UTC+02:00) Istanbul",
    iana: "Europe/Istanbul",
    offset: 3,
    isdst: true,
    abbr: "TDT"
  },
  {
    value: "Israel Standard Time",
    text: "(UTC+02:00) Jerusalem",
    iana: "Asia/Jerusalem",
    offset: 3,
    isdst: true,
    abbr: "JDT"
  },
  {
    value: "Libya Standard Time",
    text: "(UTC+02:00) Tripoli",
    iana: "Africa/Tripoli",
    offset: 2,
    isdst: false,
    abbr: "LST"
  },
  {
    value: "Jordan Standard Time",
    text: "(UTC+03:00) Amman",
    iana: "Asia/Amman",
    offset: 3,
    isdst: false,
    abbr: "JST"
  },
  {
    value: "Arabic Standard Time",
    text: "(UTC+03:00) Baghdad",
    iana: "Asia/Baghdad",
    offset: 3,
    isdst: false,
    abbr: "AST"
  },
  {
    value: "Kaliningrad Standard Time",
    text: "(UTC+03:00) Kaliningrad, Minsk",
    iana: "Europe/Kaliningrad",
    offset: 3,
    isdst: false,
    abbr: "KST"
  },
  {
    value: "Arab Standard Time",
    text: "(UTC+03:00) Kuwait, Riyadh",
    iana: "Asia/Riyadh",
    offset: 3,
    isdst: false,
    abbr: "AST"
  },
  {
    value: "E. Africa Standard Time",
    text: "(UTC+03:00) Nairobi",
    iana: "Africa/Nairobi",
    offset: 3,
    isdst: false,
    abbr: "EAST"
  },
  {
    value: "Iran Standard Time",
    text: "(UTC+03:30) Tehran",
    iana: "Asia/Tehran",
    offset: 3.5,
    isdst: true,
    abbr: "IDT"
  },
  {
    value: "Arabian Standard Time",
    text: "(UTC+04:00) Abu Dhabi, Muscat",
    iana: "Asia/Dubai",
    offset: 4,
    isdst: false,
    abbr: "AST"
  },
  {
    value: "Azerbaijan Standard Time",
    text: "(UTC+04:00) Baku",
    iana: "Asia/Baku",
    offset: 4,
    isdst: true,
    abbr: "ADT"
  },
  {
    value: "Russian Standard Time",
    text: "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
    iana: "Europe/Moscow",
    offset: 4,
    isdst: false,
    abbr: "RST"
  },
  {
    value: "Mauritius Standard Time",
    text: "(UTC+04:00) Port Louis",
    iana: "Indian/Mauritius",
    offset: 4,
    isdst: false,
    abbr: "MST"
  },
  {
    value: "Georgian Standard Time",
    text: "(UTC+04:00) Tbilisi",
    iana: "Asia/Tbilisi",
    offset: 4,
    isdst: false,
    abbr: "GST"
  },
  {
    value: "Caucasus Standard Time",
    text: "(UTC+04:00) Yerevan",
    iana: "Asia/Yerevan",
    offset: 4,
    isdst: false,
    abbr: "CST"
  },
  {
    value: "Afghanistan Standard Time",
    text: "(UTC+04:30) Kabul",
    iana: "Asia/Kabul",
    offset: 4.5,
    isdst: false,
    abbr: "AST"
  },
  {
    value: "West Asia Standard Time",
    text: "(UTC+05:00) Ashgabat, Tashkent",
    iana: "Asia/Tashkent",
    offset: 5,
    isdst: false,
    abbr: "WAST"
  },
  {
    value: "Pakistan Standard Time",
    text: "(UTC+05:00) Islamabad, Karachi",
    iana: "Asia/Karachi",
    offset: 5,
    isdst: false,
    abbr: "PST"
  },
  {
    value: "India Standard Time",
    text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    iana: "Asia/Kolkata",
    offset: 5.5,
    isdst: false,
    abbr: "IST"
  },
  {
    value: "Sri Lanka Standard Time",
    text: "(UTC+05:30) Sri Jayawardenepura",
    iana: "Asia/Colombo",
    offset: 5.5,
    isdst: false,
    abbr: "SLST"
  },
  {
    value: "Nepal Standard Time",
    text: "(UTC+05:45) Kathmandu",
    iana: "Asia/Kathmandu",
    offset: 5.75,
    isdst: false,
    abbr: "NST"
  },
  {
    value: "Central Asia Standard Time",
    text: "(UTC+06:00) Astana",
    iana: "Asia/Almaty",
    offset: 6,
    isdst: false,
    abbr: "CAST"
  },
  {
    value: "Bangladesh Standard Time",
    text: "(UTC+06:00) Dhaka",
    iana: "Asia/Dhaka",
    offset: 6,
    isdst: false,
    abbr: "BST"
  },
  {
    value: "Ekaterinburg Standard Time",
    text: "(UTC+06:00) Ekaterinburg",
    iana: "Asia/Yekaterinburg",
    offset: 6,
    isdst: false,
    abbr: "EST"
  },
  {
    value: "Myanmar Standard Time",
    text: "(UTC+06:30) Yangon (Rangoon)",
    iana: "Asia/Yangon",
    offset: 6.5,
    isdst: false,
    abbr: "MST"
  },
  {
    value: "SE Asia Standard Time",
    text: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    iana: "Asia/Bangkok",
    offset: 7,
    isdst: false,
    abbr: "SAST"
  },
  {
    value: "China Standard Time",
    text: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    iana: "Asia/Shanghai",
    offset: 8,
    isdst: false,
    abbr: "CST"
  },
  {
    value: "Tokyo Standard Time",
    text: "(UTC+09:00) Osaka, Sapporo, Tokyo",
    iana: "Asia/Tokyo",
    offset: 9,
    isdst: false,
    abbr: "TST"
  },
  {
    value: "Korea Standard Time",
    text: "(UTC+09:00) Seoul",
    iana: "Asia/Seoul",
    offset: 9,
    isdst: false,
    abbr: "KST"
  },
  {
    value: "AUS Eastern Standard Time",
    text: "(UTC+10:00) Canberra, Melbourne, Sydney",
    iana: "Australia/Sydney",
    offset: 10,
    isdst: false,
    abbr: "AEST"
  }
]

export default timezones;
