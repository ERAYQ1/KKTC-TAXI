-- Local development seed data.
-- Every record below is FICTIONAL. Do not add real drivers, real phone
-- numbers or any other personal data to this file: it is committed to a
-- public repository.

insert into taxis (name, phone, whatsapp, price_info, region, description, is_24_7, featured, active)
values
  (
    'Demo Girne Havalimanı Transfer',
    '0533 000 00 01',
    '0533 000 00 01',
    'Ercan 600 TL, şehir içi 150 TL',
    'girne',
    'Örnek kayıt. Havalimanı transferi ve şehir içi taşımacılık.',
    true,
    true,
    true
  ),
  (
    'Demo Lefkoşa Merkez Taksi',
    '0533 000 00 02',
    '0533 000 00 02',
    'Şehir içi 120 TL',
    'lefkosa',
    'Örnek kayıt. Lefkoşa merkez ve çevresi.',
    false,
    false,
    true
  ),
  (
    'Demo Gazimağusa Sahil Taksi',
    '0533 000 00 03',
    '0533 000 00 03',
    'Şehir içi 130 TL',
    'gazimagusa',
    'Örnek kayıt. Sahil bölgesi ve üniversite çevresi.',
    true,
    false,
    true
  ),
  (
    'Demo İskele Taksi',
    '0533 000 00 04',
    '0533 000 00 04',
    'Şehir içi 110 TL',
    'iskele',
    'Örnek kayıt.',
    false,
    false,
    true
  ),
  (
    'Demo Pasif Kayıt (sitede görünmez)',
    '0533 000 00 05',
    '0533 000 00 05',
    null,
    'lefke',
    'Örnek pasif kayıt. Yönetim panelinde görünür, sitede görünmez.',
    false,
    false,
    false
  );
