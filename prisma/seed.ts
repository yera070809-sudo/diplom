import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Очистка БД перед сидированием для предотвращения дубликатов
  console.log('Очистка базы данных...')
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.room.deleteMany()
  await prisma.roomType.deleteMany()
  await prisma.service.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()

  // Хеширование паролей
  const adminPassword = await bcrypt.hash('admin123', 10)
  const guestPassword = await bcrypt.hash('guest123', 10)

  // 1. Создание Администратора
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hotel.com',
      name: 'Администратор',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+7 (727) 123-45-67'
    }
  })
  console.log('Создан Администратор:', admin.email)

  // 2. Создание 12 реалистичных Гостей
  const guestsData = [
    { email: 'guest@hotel.com', name: 'Гость (Демо)', phone: '+7 (777) 000-00-00' },
    { email: 'alihan.n@gmail.com', name: 'Алихан Найман', phone: '+7 (701) 555-12-34' },
    { email: 'aisha.s@mail.ru', name: 'Айша Султанова', phone: '+7 (777) 123-45-67' },
    { email: 'daniyar.a@outlook.com', name: 'Данияр Ахметов', phone: '+7 (705) 987-65-43' },
    { email: 'madina.i@yandex.ru', name: 'Мадина Ибрагимова', phone: '+7 (747) 111-22-33' },
    { email: 'nurlan.a@gmail.com', name: 'Нурлан Асанов', phone: '+7 (702) 444-55-66' },
    { email: 'anel.s@mail.ru', name: 'Анель Серикова', phone: '+7 (708) 888-99-00' },
    { email: 'ruslan.k@gmail.com', name: 'Руслан Каримов', phone: '+7 (775) 222-33-44' },
    { email: 'zarina.t@mail.ru', name: 'Зарина Тулегенова', phone: '+7 (707) 333-44-55' },
    { email: 'bakhtiyar.o@gmail.com', name: 'Бахтияр Оспанов', phone: '+7 (747) 555-66-77' },
    { email: 'erbol.k@mail.ru', name: 'Ербол Кусаинов', phone: '+7 (701) 777-88-99' },
    { email: 'gulnara.i@yandex.ru', name: 'Гульнара Исина', phone: '+7 (702) 999-00-11' },
  ]

  const guests = []
  for (const gd of guestsData) {
    const user = await prisma.user.create({
      data: {
        email: gd.email,
        name: gd.name,
        password: guestPassword,
        role: 'GUEST',
        phone: gd.phone
      }
    })
    guests.push(user)
  }
  console.log(`Создано гостей: ${guests.length}`)

  // 3. Категории номеров с полноценными характеристиками и правилами отеля
  const roomTypesData = [
    {
      name: 'Deluxe Garden View Room',
      description: 'Изысканный делюкс-номер с панорамными окнами и прямым выходом в благоустроенный внутренний сад отеля. Авторский текстиль, мебель из массива дуба и круглосуточный консьерж-сервис.',
      price: 95000,
      capacity: 3,
      amenities: ['Wi-Fi 1 Гбит', 'King-size кровать', 'Балкон с видом на сад', 'Доступ в спа-комплекс', 'Премиальный мини-бар'],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '45 м²',
      bed: '1 двуспальная King-size',
      view: 'Живописный внутренний сад отеля',
      breakfast: 'Завтрак «Шведский стол» включен',
      features: ['Прямой выход в сад', 'Индивидуальная терраса', 'Ванная комната из мрамора', 'Кофемашина Nespresso'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена бронирования за 24 часа до заезда.',
      childrenPolicy: 'Размещение детей до 6 лет на имеющихся кроватях предоставляется бесплатно.',
      petsPolicy: 'Размещение с животными не допускается.',
      rooms: ['AG-101', 'AG-102', 'AG-103']
    },
    {
      name: 'Sky Deluxe King Room',
      description: 'Эксклюзивный номер на верхних этажах отеля с захватывающим панорамным видом на Заилийский Алатау. Ванная комната из итальянского мрамора и фирменное обслуживание от Almaty Grand Hotel.',
      price: 125000,
      capacity: 2,
      amenities: ['Панорамные окна', 'Персональный дворецкий 24/7', 'Дождевой тропический душ', 'Ароматерапия', 'Доступ в клубный лаундж'],
      images: [
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '55 м²',
      bed: '1 двуспальная Super King-size',
      view: 'Величественные горы Заилийского Алатау',
      breakfast: 'Завтрак a la carte в клубном лаундже включен',
      features: ['Вид на горы', 'Ванна с панорамным окном', 'Доступ в VIP-лаундж', 'Акустика Bang & Olufsen'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена бронирования за 48 часов до заезда.',
      childrenPolicy: 'Размещение детей младше 12 лет на дополнительных кроватях — 15 000 ₸ в сутки.',
      petsPolicy: 'Размещение с животными не допускается.',
      rooms: ['AG-2701', 'AG-2702']
    },
    {
      name: 'Presidential Ambassador Suite',
      description: 'Роскошный представительский сьют в неоклассическом стиле с отдельной просторной гостиной, библиотекой, камином и авторскими завтраками от шеф-повара прямо в номер.',
      price: 140000,
      capacity: 4,
      amenities: ['Персональный консьерж', 'Ванна с панорамным видом', 'Камин в гостиной', 'Акустика Bang & Olufsen', 'Приватный трансфер'],
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '140 м²',
      bed: '2 большие двуспальные King-size',
      view: 'Панорамный обзор 360° на горы и центр города',
      breakfast: 'Индивидуальный VIP-завтрак в номер от Шеф-повара включен',
      features: ['Собственный камин', 'Персональный батлер 24/7', 'Просторная гостиная', 'Кухня и столовая зона'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 7 дней до заезда. При более поздней отмене удерживается 100% стоимости первой ночи.',
      childrenPolicy: 'Размещение детей любого возраста на имеющихся кроватях бесплатно.',
      petsPolicy: 'Допускается размещение собак мелких пород (до 7 кг) с депозитом 50 000 ₸.',
      rooms: ['AG-501', 'AG-502']
    },
    {
      name: 'Executive Business Room',
      description: 'Современный номер премиум-класса с выделенной эргономичной рабочей зоной, капсульной кофемашиной и доступом в закрытый VIP-лаундж отеля с вечерним фуршетом.',
      price: 72000,
      capacity: 2,
      amenities: ['Эргономичное рабочее место', 'Капсульная кофемашина', 'Умный дом (свет/климат)', 'Сауна и хаммам', 'Поздний выезд до 15:00'],
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '38 м²',
      bed: '1 двуспальная King-size',
      view: 'Городской пейзаж и деловой центр',
      breakfast: 'Завтрак «Шведский стол» включен',
      features: ['Эргономичный кабинет', 'Умный дом с планшетом', 'Доступ в закрытый VIP-клуб', 'Бесплатная экспресс-химчистка'],
      checkInTime: '14:00',
      checkOutTime: '14:00', // Поздний выезд по умолчанию
      cancellationPolicy: 'Бесплатная отмена за 24 часа до заезда.',
      childrenPolicy: 'Номер ориентирован на деловых гостей; размещение детей возможно от 12 лет.',
      petsPolicy: 'Размещение с домашними животными не разрешается.',
      rooms: ['AG-601', 'AG-602', 'AG-603']
    },
    {
      name: 'Club Mountain View Room',
      description: 'Элегантный клубный номер на верхних этажах. Индивидуальная регистрация при заезде, изысканное меню подушек и потрясающий прямой вид на горные вершины.',
      price: 68000,
      capacity: 2,
      amenities: ['Доступ в закрытый клуб', 'Двухзонная подсветка', 'Меню изысканных ароматов', 'Улучшенная звукоизоляция', 'Тёплый пол в ванной'],
      images: [
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '40 м²',
      bed: '1 двуспальная King-size',
      view: 'Великолепный прямой вид на горы',
      breakfast: 'Завтрак в клубном ресторане включен',
      features: ['Панорамный вид на Алатау', 'Меню подушек', 'Двухзонная дизайнерская подсветка', 'Тёплый пол в ванной комнате'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 24 часа до заезда.',
      childrenPolicy: 'Дети до 6 лет проживают бесплатно без предоставления доп. места.',
      petsPolicy: 'Размещение с питомцами не допускается.',
      rooms: ['AG-701', 'AG-702', 'AG-703']
    },
    {
      name: 'Superior Park View Room',
      description: 'Классический интерьер с паркетным полом из натурального дерева, французскими балконами и прекрасным видом на ухоженный парк перед отелем.',
      price: 54000,
      capacity: 3,
      amenities: ['Французский балкон', 'Мраморная отделка ванной', 'Бесплатный мини-бар', 'Доступ в 25-м бассейн', 'Услуги батлера'],
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '36 м²',
      bed: '1 большая двуспальная или 2 раздельные',
      view: 'Центральный зеленый парк отеля',
      breakfast: 'Завтрак «Шведский стол» включен',
      features: ['Французский балкон', 'Натуральный дубовый паркет', 'Бесплатный пополняемый мини-бар', 'Мраморная ванная комната'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 24 часа.',
      childrenPolicy: 'Проживание детей до 7 лет бесплатно.',
      petsPolicy: 'Размещение с животными запрещено.',
      rooms: ['AG-401', 'AG-402', 'AG-403']
    },
    {
      name: 'Grand Panorama Room',
      description: 'Современный номер в стиле скандинавского минимализма. Огромные панорамные окна во всю стену открывают захватывающий вид на холм Кок-Тобе.',
      price: 47000,
      capacity: 2,
      amenities: ['Умный телевизор (Smart TV)', 'Зарядные порты USB-C', 'Панорамное остекление', 'Бесконтактный заезд', 'Фитнес-зал 24/7'],
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '34 м²',
      bed: '1 двуспальная Queen-size',
      view: 'Панорама города и холм Кок-Тобе',
      breakfast: 'Завтрак оплачивается отдельно (9 000 ₸)',
      features: ['Панорамное остекление от пола до потолка', 'Умная колонка Яндекс.Алиса', 'Автоматические шторы блэкаут', 'Современный эргономичный душ'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 24 часа до заезда.',
      childrenPolicy: 'Размещение детей до 6 лет бесплатно на имеющихся местах.',
      petsPolicy: 'Размещение с животными не разрешается.',
      rooms: ['AG-901', 'AG-902', 'AG-903']
    },
    {
      name: 'Executive King Room',
      description: 'Просторный представительский номер с одной большой кроватью King-size, исключительной звукоизоляцией и рабочей зоной с док-станцией для гаджетов.',
      price: 42000,
      capacity: 2,
      amenities: ['Мультимедийная док-станция', 'Шумоизоляция 45 дБ', 'Обслуживание в номере 24/7', 'Подогрев полов', 'Высокоскоростной Wi-Fi'],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '32 м²',
      bed: '1 двуспальная King-size',
      view: 'Городские улицы и внутренний дворик',
      breakfast: 'Завтрак доступен за доплату',
      features: ['Улучшенная звукоизоляция (45 дБ)', 'Док-станция с беспроводной зарядкой', 'Подогрев пола в прихожей', 'Косметический набор премиум-класса'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 24 часа до заезда.',
      childrenPolicy: 'Дети до 5 лет проживают бесплатно без доп. места.',
      petsPolicy: 'Размещение с животными запрещено.',
      rooms: ['AG-301', 'AG-302', 'AG-303']
    },
    {
      name: 'Privilege Designer Suite',
      description: 'Великолепный двухкомнатный дизайнерский сьют с эксклюзивной мебелью, стильным кофейным баром и возможностью организации приватного ужина от шеф-повара.',
      price: 61000,
      capacity: 3,
      amenities: ['Эксклюзивная мебель', 'Акустика с Bluetooth', 'Персональный кофейный бар', 'Светонепроницаемые шторы', 'Приватный ужин'],
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '50 м²',
      bed: '1 большая двуспальная King-size',
      view: 'Панорамный вид на проспект и горы',
      breakfast: 'Завтрак включен в стоимость проживания',
      features: ['Две комнаты (гостиная и спальня)', 'Эксклюзивная дизайнерская мебель', 'Акустическая система Harman Kardon', 'Собственный мини-бар с коллекционными винами'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Отмена без штрафа за 48 часов до заезда.',
      childrenPolicy: 'Размещение одного ребенка до 12 лет на дополнительном диване бесплатно.',
      petsPolicy: 'Размещение с животными не предусмотрено.',
      rooms: ['AG-201', 'AG-202']
    },
    {
      name: 'Premium Family Studio',
      description: 'Просторная семейная студия: отдельная мастер-спальня, уютная игровая зона для детей и полностью укомплектованная мини-кухня в нежных пастельных тонах.',
      price: 36000,
      capacity: 4,
      amenities: ['Собственная мини-кухня', 'Детский игровой уголок', 'Служба прачечной в отеле', 'Натуральный паркет', 'Лаундж-зона'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80'
      ],
      area: '48 м²',
      bed: '1 двуспальная King-size и 1 двухъярусная детская кровать',
      view: 'Внутренний дворик отеля и детская площадка',
      breakfast: 'Семейный завтрак «Шведский стол» включен',
      features: ['Полностью укомплектованная мини-кухня', 'Детская игровая зона с игрушками', 'Ванная комната с детскими аксессуарами', 'Стиральная машина в номере'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Бесплатная отмена за 24 часа.',
      childrenPolicy: 'Дети любого возраста приветствуются. Все принадлежности (кроватки, стульчики) предоставляются бесплатно.',
      petsPolicy: 'Размещение с небольшими питомцами (до 5 кг) возможно по предварительному согласованию (+10 000 ₸ в сутки).',
      rooms: ['AG-1101', 'AG-1102', 'AG-1103']
    }
  ]

  const dbRooms: { id: string; number: string; typeName: string; price: number }[] = []

  for (const rt of roomTypesData) {
    const createdType = await prisma.roomType.create({
      data: {
        name: rt.name,
        description: rt.description,
        price: rt.price,
        capacity: rt.capacity,
        amenities: JSON.stringify(rt.amenities),
        images: JSON.stringify(rt.images),
        area: rt.area,
        bed: rt.bed,
        view: rt.view,
        breakfast: rt.breakfast,
        features: JSON.stringify(rt.features),
        checkInTime: rt.checkInTime,
        checkOutTime: rt.checkOutTime,
        cancellationPolicy: rt.cancellationPolicy,
        childrenPolicy: rt.childrenPolicy,
        petsPolicy: rt.petsPolicy,
        rooms: {
          create: rt.rooms.map((number) => ({ number }))
        }
      },
      include: {
        rooms: true
      }
    })

    createdType.rooms.forEach(r => {
      dbRooms.push({
        id: r.id,
        number: r.number,
        typeName: createdType.name,
        price: createdType.price
      })
    })
  }

  console.log(`Добавлено категорий номеров: ${roomTypesData.length}. Физических комнат: ${dbRooms.length}`)

  // 4. Добавление Услуг
  const services = [
    {
      name: 'Шеф-завтрак a la carte',
      description: 'Авторские блюда, свежая выпечка и cold-pressed соки',
      price: 9000
    },
    {
      name: 'Premium трансфер Mercedes V-Class',
      description: 'Встреча у трапа самолёта и персональный водитель',
      price: 18000
    },
    {
      name: 'Экскурсия на Кок-Тобе',
      description: 'Приватный гид, билеты на канатную дорогу и фотосессия',
      price: 22000
    },
    {
      name: 'Sky Spa Ritual',
      description: '90-минутный массаж, сауна и чайная церемония',
      price: 26000
    },
    {
      name: 'Личный тренер и бассейн',
      description: 'Индивидуальная тренировка и VIP-доступ в фитнес-зал',
      price: 15000
    },
    {
      name: 'Организация романтического вечера',
      description: 'Декор, свечи, цветы и ужин с видом на горы',
      price: 30000
    },
    {
      name: 'Детский клуб на целый день',
      description: 'Аниматоры, кулинарный мастер-класс и VR-зона',
      price: 12000
    },
    {
      name: 'Поздний выезд до 20:00',
      description: 'Продление пребывания, доступ в бассейн и лаундж',
      price: 14000
    }
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }
  console.log(`Добавлено дополнительных услуг: ${services.length}`)

  // 5. Сидирование настроек отеля
  const settings = [
    { key: 'hotel_name', value: 'Almaty Grand Hotel' },
    { key: 'hotel_phone', value: '+7 (727) 123-45-67' },
    { key: 'hotel_email', value: 'info@almatygrand.kz' },
    { key: 'hotel_address', value: 'Республика Казахстан, г. Алматы, ул. Достык, 85, почтовый индекс 050010' },
    { key: 'hotel_map_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.772583802773!2d76.95379657662991!3d43.2351838791379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d2906.772583802773!2d76.95379657662991!3d43.2351838791379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m1!2zNzDCsDU2JzA2LjciTiA3NsKwNTcnMjIuOSJF!5e0!3m2!1sru!2skz!4v1716490000000!5m2!1sru!2skz' },
    { key: 'about_hero_title', value: 'Искусство Роскоши и Гостеприимства' },
    { key: 'about_hero_subtitle', value: 'С 2010 года Almaty Grand Hotel является символом безупречного сервиса, утонченности и комфорта в самом сердце южной столицы Казахстана.' },
    { key: 'about_philosophy_title', value: 'Где Величественные Горы Встречаются с Современной Элегантностью' },
    { key: 'about_philosophy_text_1', value: 'Almaty Grand Hotel расположен в историческом и культурном центре города, у самого подножия величественных вершин Заилийского Алатау. Мы создали пространство, в котором гармонично сочетаются ритм современного мегаполиса и умиротворение горной природы.' },
    { key: 'about_philosophy_text_2', value: 'Каждый гость для нас — это особая история. За 15 лет работы мы завоевали репутацию одного из лучших отелей Казахстана, став домом для глав государств, деятелей искусства и взыскательных путешественников со всего мира.' },
    { key: 'about_philosophy_text_3', value: 'Наша главная ценность — предвосхищать ваши ожидания. Мы уделяем внимание мельчайшим деталям, чтобы каждый момент вашего пребывания был наполнен абсолютным комфортом.' }
  ]

  for (const setting of settings) {
    await prisma.setting.create({ data: setting })
  }
  console.log(`Добавлено настроек отеля: ${settings.length}`)

  // 6. Сидирование FAQ
  const faqs = [
    {
      question: 'Как забронировать номер?',
      answer: 'Вы можете забронировать номер онлайн на нашем сайте, выбрав даты заезда и выезда, количество гостей и тип номера. Также можно позвонить по телефону +7 (727) 123-45-67 или написать на email booking@almatygrand.kz.',
      category: 'Бронирование',
      order: 1
    },
    {
      question: 'Можно ли отменить бронирование?',
      answer: 'Да, бесплатная отмена возможна не позднее чем за 24 часа до даты заезда. При отмене менее чем за 24 часа взимается штраф в размере стоимости первой ночи.',
      category: 'Бронирование',
      order: 2
    },
    {
      question: 'Нужна ли предоплата?',
      answer: 'Для гарантии бронирования требуется предоплата в размере 30% от общей стоимости. Остаток оплачивается при заселении. Принимаем наличные и банковские карты.',
      category: 'Бронирование',
      order: 3
    },
    {
      question: 'Можно ли изменить даты бронирования?',
      answer: 'Да, изменение дат возможно при наличии свободных номеров. Пожалуйста, свяжитесь с нами заранее через личный кабинет или по телефону.',
      category: 'Бронирование',
      order: 4
    },
    {
      question: 'Во сколько заселение и выезд?',
      answer: 'Стандартное время заселения — с 14:00, выезда — до 12:00. Ранний заезд и поздний выезд возможны при наличии свободных номеров за дополнительную плату.',
      category: 'Заселение и выезд',
      order: 1
    },
    {
      question: 'Какие документы нужны для заселения?',
      answer: 'Для граждан Казахстана — удостоверение личности. Для иностранных гостей — паспорт с действующей визой (если требуется). Все гости старше 18 лет регистрируются отдельно.',
      category: 'Заселение и выезд',
      order: 2
    },
    {
      question: 'Можно ли оставить багаж до/после заселения?',
      answer: 'Да, мы предоставляем бесплатную камеру хранения для гостей, прибывающих раньше времени заезда или выезжающих позже.',
      category: 'Заселение и выезд',
      order: 3
    },
    {
      question: 'Есть ли в номерах Wi-Fi?',
      answer: 'Да, бесплатный высокоскоростной Wi-Fi доступен во всех номерах и общественных зонах отеля.',
      category: 'Номера и услуги',
      order: 1
    },
    {
      question: 'Включён ли завтрак в стоимость?',
      answer: 'Завтрак включён в стоимость номеров категории Люкс и Семейный люкс. Для стандартных номеров завтрак можно заказать дополнительно.',
      category: 'Номера и услуги',
      order: 2
    },
    {
      question: 'Есть ли парковка?',
      answer: 'Да, для гостей отеля доступна охраняемая подземная парковка. Стоимость — 2000 ₸ в сутки. Для номеров категории Люкс парковка бесплатная.',
      category: 'Номера и услуги',
      order: 3
    },
    {
      question: 'Можно ли с домашними животными?',
      answer: 'К сожалению, размещение с домашними животными не допускается, за исключением собак-поводырей.',
      category: 'Номера и услуги',
      order: 4
    },
    {
      question: 'Есть ли трансфер из аэропорта?',
      answer: 'Да, мы предоставляем трансфер из/в международный аэропорт Алматы. Стоимость — 8000 ₸ в одну сторону. Закажите при бронировании или свяжитесь с нами.',
      category: 'Номера и услуги',
      order: 5
    },
    {
      question: 'Какие способы оплаты принимаются?',
      answer: 'Мы принимаем наличные (тенге), банковские карты (Visa, MasterCard, American Express) и переводы на банковский счёт для корпоративных клиентов.',
      category: 'Оплата',
      order: 1
    },
    {
      question: 'Можно ли получить счёт-фактуру?',
      answer: 'Да, мы предоставляем все необходимые документы для юридических лиц: счёт-фактуры, акты выполненных работ. Укажите реквизиты компании при бронировании.',
      category: 'Оплата',
      order: 2
    }
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }
  console.log(`Добавлено вопросов FAQ: ${faqs.length}`)


  // 7. Создание 30+ реалистичных БРОНИРОВАНИЙ (Прошлые, Текущие, Будущие, Отмененные)
  // Базовая дата: 24 мая 2026 года
  console.log('Создание реалистичных бронирований...')

  const baseDate = new Date('2026-05-24T12:00:00')

  const bookingsData = [
    // --- ПРОШЛЫЕ БРОНИРОВАНИЯ (COMPLETED & PAID) ---
    {
      guestIdx: 1, // Алихан Найман
      roomNumber: 'AG-2701', // Sky Deluxe King
      checkInOffset: -20, // 4 мая
      duration: 4, // по 8 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 2, // Айша Султанова
      roomNumber: 'AG-101', // Deluxe Garden View
      checkInOffset: -18, // 6 мая
      duration: 3, // по 9 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 3, // Данияр Ахметов
      roomNumber: 'AG-501', // Presidential Ambassador
      checkInOffset: -15, // 9 мая
      duration: 5, // по 14 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 4, // Мадина Ибрагимова
      roomNumber: 'AG-601', // Executive Business Room
      checkInOffset: -12, // 12 мая
      duration: 3, // по 15 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 5, // Нурлан Асанов
      roomNumber: 'AG-701', // Club Mountain View
      checkInOffset: -10, // 14 мая
      duration: 4, // по 18 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 6, // Анель Серикова
      roomNumber: 'AG-401', // Superior Park View
      checkInOffset: -9, // 15 мая
      duration: 2, // по 17 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 7, // Руслан Каримов
      roomNumber: 'AG-901', // Grand Panorama
      checkInOffset: -8, // 16 мая
      duration: 4, // по 20 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 8, // Зарина Тулегенова
      roomNumber: 'AG-301', // Executive King Room
      checkInOffset: -7, // 17 мая
      duration: 3, // по 20 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 9, // Бахтияр Оспанов
      roomNumber: 'AG-201', // Privilege Designer Suite
      checkInOffset: -6, // 18 мая
      duration: 5, // по 23 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 10, // Ербол Кусаинов
      roomNumber: 'AG-1101', // Premium Family Studio
      checkInOffset: -5, // 19 мая
      duration: 4, // по 23 мая
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },

    // --- ТЕКУЩИЕ АКТИВНЫЕ БРОНИРОВАНИЯ (CONFIRMED & PAID) ---
    {
      guestIdx: 0, // Гость (Демо)
      roomNumber: 'AG-102', // Deluxe Garden View
      checkInOffset: -3, // 21 мая
      duration: 5, // по 26 мая (Выезжает завтра)
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 11, // Гульнара Исина
      roomNumber: 'AG-2702', // Sky Deluxe King
      checkInOffset: -2, // 22 мая
      duration: 6, // по 28 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 1, // Алихан Найман
      roomNumber: 'AG-502', // Presidential Ambassador
      checkInOffset: -1, // 23 мая
      duration: 4, // по 27 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 2, // Айша Султанова
      roomNumber: 'AG-602', // Executive Business Room
      checkInOffset: -2, // 22 мая
      duration: 4, // по 26 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 3, // Данияр Ахметов
      roomNumber: 'AG-702', // Club Mountain View
      checkInOffset: 0, // Заехал сегодня (24 мая)
      duration: 3, // по 27 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 4, // Мадина Ибрагимова
      roomNumber: 'AG-402', // Superior Park View
      checkInOffset: -1, // 23 мая
      duration: 3, // по 26 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 5, // Нурлан Асанов
      roomNumber: 'AG-902', // Grand Panorama
      checkInOffset: 0, // Заехал сегодня (24 мая)
      duration: 5, // по 29 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },

    // --- БУДУЩИЕ БРОНИРОВАНИЯ (PENDING или CONFIRMED) ---
    {
      guestIdx: 6, // Анель Серикова
      roomNumber: 'AG-103', // Deluxe Garden View
      checkInOffset: 2, // 26 мая
      duration: 3, // по 29 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 7, // Руслан Каримов
      roomNumber: 'AG-302', // Executive King Room
      checkInOffset: 3, // 27 мая
      duration: 4, // по 31 мая
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 8, // Зарина Тулегенова
      roomNumber: 'AG-202', // Privilege Designer Suite
      checkInOffset: 4, // 28 мая
      duration: 5, // по 2 июня
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },
    {
      guestIdx: 9, // Бахтияр Оспанов
      roomNumber: 'AG-1102', // Premium Family Studio
      checkInOffset: 5, // 29 мая
      duration: 6, // по 4 июня
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 10, // Ербол Кусаинов
      roomNumber: 'AG-2701', // Sky Deluxe King
      checkInOffset: 6, // 30 мая
      duration: 3, // по 2 июня
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },
    {
      guestIdx: 11, // Гульнара Исина
      roomNumber: 'AG-501', // Presidential Ambassador Suite
      checkInOffset: 8, // 1 июня
      duration: 4, // по 5 июня
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 1, // Алихан Найман
      roomNumber: 'AG-603', // Executive Business Room
      checkInOffset: 10, // 3 июня
      duration: 5, // по 8 июня
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    {
      guestIdx: 2, // Айша Султанова
      roomNumber: 'AG-703', // Club Mountain View Room
      checkInOffset: 12, // 5 июня
      duration: 4, // по 9 июня
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },

    // --- ОТМЕНЕННЫЕ БРОНИРОВАНИЯ (CANCELLED) ---
    {
      guestIdx: 4, // Мадина Ибрагимова
      roomNumber: 'AG-101', // Deluxe Garden View
      checkInOffset: -5, // 19 мая
      duration: 3,
      status: 'CANCELLED',
      paymentStatus: 'UNPAID',
    },
    {
      guestIdx: 8, // Зарина Тулегенова
      roomNumber: 'AG-903', // Grand Panorama
      checkInOffset: 2, // 26 мая
      duration: 2,
      status: 'CANCELLED',
      paymentStatus: 'UNPAID',
    }
  ]

  const createdBookings = []

  for (const b of bookingsData) {
    const guestUser = guests[b.guestIdx]
    const targetRoom = dbRooms.find(r => r.number === b.roomNumber)

    if (!targetRoom) {
      console.warn(`Комната ${b.roomNumber} не найдена в базе данных! Пропуск.`)
      continue
    }

    // Расчет дат
    const checkIn = new Date(baseDate)
    checkIn.setDate(baseDate.getDate() + b.checkInOffset)
    checkIn.setHours(14, 0, 0, 0)

    const checkOut = new Date(checkIn)
    checkOut.setDate(checkIn.getDate() + b.duration)
    checkOut.setHours(12, 0, 0, 0)

    // Расчет стоимости
    const totalPrice = targetRoom.price * b.duration

    // Услуги для некоторых бронирований
    const hasExtras = b.guestIdx % 2 === 0
    const extrasObj = hasExtras ? [
      { name: 'Шеф-завтрак a la carte', price: 9000 },
      { name: 'Sky Spa Ritual', price: 26000 }
    ] : []

    const finalPrice = totalPrice + extrasObj.reduce((sum, item) => sum + item.price, 0)

    const booking = await prisma.booking.create({
      data: {
        userId: guestUser.id,
        roomId: targetRoom.id,
        checkIn,
        checkOut,
        totalPrice: finalPrice,
        extras: hasExtras ? JSON.stringify(extrasObj) : null,
        status: b.status,
        paymentStatus: b.paymentStatus,
        createdAt: new Date(checkIn.getTime() - 1000 * 60 * 60 * 24 * 3) // Забронировано за 3 дня до заезда
      }
    })

    createdBookings.push({
      id: booking.id,
      guestName: guestUser.name,
      guestId: guestUser.id,
      roomNumber: b.roomNumber,
      status: b.status,
      typeName: targetRoom.typeName
    })
  }

  console.log(`Успешно создано бронирований: ${createdBookings.length}`)

  // 8. Создание 15+ реалистичных ОТЗЫВОВ гостей
  // Мы привязываем отзывы к завершенным или подтвержденным прошлым бронированиям
  console.log('Создание отзывов гостей...')

  const reviewsData = [
    {
      roomType: 'Sky Deluxe King Room',
      rating: 5,
      comment: 'Потрясающий отель! Панорамный вид на горы Заилийского Алатау из ванны — это невероятно. Просыпаться с таким видом — чистейшее удовольствие. Обслуживание идеальное, дворецкий был очень любезен. Обязательно вернемся!',
      guestName: 'Алихан Найман'
    },
    {
      roomType: 'Deluxe Garden View Room',
      rating: 5,
      comment: 'Замечательно провели семейные выходные! Номер с выходом в сад невероятно тихий, чистый и комфортный. Ребенок в восторге от бассейна и детской площадки. Завтраки выше всяких похвал!',
      guestName: 'Айша Султанова'
    },
    {
      roomType: 'Presidential Ambassador Suite',
      rating: 5,
      comment: 'Абсолютный триумф роскоши. Каминный зал, безукоризненный стиль, личный батлер помогал в любых вопросах 24/7. Ужин от шеф-повара на террасе стал кульминацией поездки. Отель мирового уровня.',
      guestName: 'Данияр Ахметов'
    },
    {
      roomType: 'Executive Business Room',
      rating: 4,
      comment: 'Удобный номер для бизнес-поездок. Прекрасно оборудованное рабочее место, высокоскоростной Wi-Fi. Очень понравился VIP-лаундж с вечерними закусками. Снижаю оценку на 1 балл из-за небольшой задержки при выписке.',
      guestName: 'Мадина Ибрагимова'
    },
    {
      roomType: 'Club Mountain View Room',
      rating: 5,
      comment: 'Изумительный вид на горы и великолепная звукоизоляция. Кровать King-size с меню подушек гарантирует идеальный сон. Клубные завтраки a la carte очень вкусные. Спа-центр и массаж вернули меня к жизни!',
      guestName: 'Нурлан Асанов'
    },
    {
      roomType: 'Superior Park View Room',
      rating: 4,
      comment: 'Классический дизайн, натуральный паркет и очень уютная атмосфера. Красивый вид на парк. Все отлично, но хотелось бы больше розеток около кровати.',
      guestName: 'Анель Серикова'
    },
    {
      roomType: 'Grand Panorama Room',
      rating: 5,
      comment: 'Скандинавский дизайн в лучшем проявлении! Вид на Кок-Тобе ошеломляющий. Очень удобно управлять номером через Алису. Все новое, чистое и современное. Рекомендую всем!',
      guestName: 'Руслан Каримов'
    },
    {
      roomType: 'Executive King Room',
      rating: 5,
      comment: 'Удобное расположение в центре, отличная шумоизоляция. Номер просторный, матрас ортопедический, спалось великолепно. Рум-сервис доставил горячий ужин за 15 минут. Отличный выбор!',
      guestName: 'Зарина Тулегенова'
    },
    {
      roomType: 'Privilege Designer Suite',
      rating: 5,
      comment: 'Потрясающий двухкомнатный сьют. Очень стильная и качественная мебель, акустика супер. Организовали приватный ужин с потрясающим видом. Ощущение полной приватности и высокого статуса.',
      guestName: 'Бахтияр Оспанов'
    },
    {
      roomType: 'Premium Family Studio',
      rating: 5,
      comment: 'Идеальный выбор для поездок с детьми. Кухня укомплектована всем необходимым, детская двухъярусная кровать привела детей в восторг. Персонал отеля очень чуткий, подготовили детские халаты и игрушки.',
      guestName: 'Ербол Кусаинов'
    },
    {
      roomType: 'Deluxe Garden View Room',
      rating: 5,
      comment: 'Уютный, тихий номер с прямым выходом на лужайку. Вокруг поют птицы, полный релакс в центре мегаполиса. Спа-комплекс и хаммам — просто супер!',
      guestName: 'Гость (Демо)'
    },
    {
      roomType: 'Sky Deluxe King Room',
      rating: 4,
      comment: 'Прекрасный вид, очень красивая ванная комната. Сервис отличный. Из минусов — в часы пик лифт приходится ждать чуть дольше обычного.',
      guestName: 'Гульнара Исина'
    },
    {
      roomType: 'Superior Park View Room',
      rating: 5,
      comment: 'Прекрасный исторический парк под окнами. Батлер был невероятно вежлив, помог распаковать вещи и принес потрясающий кофе. Настоящее пятизвездочное гостеприимство.',
      guestName: 'Айша Султанова'
    },
    {
      roomType: 'Executive Business Room',
      rating: 5,
      comment: 'Эргономика на высоте, работать в номере было максимально комфортно. Умный климат-контроль работает идеально тихо. Вечером с удовольствием сходил в сауну. Рекомендую деловым людям.',
      guestName: 'Данияр Ахметов'
    },
    {
      roomType: 'Club Mountain View Room',
      rating: 5,
      comment: 'Шикарный панорамный вид. Обслуживание на высшем уровне. Персональный трансфер из аэропорта на шикарном Mercedes V-Class прошел безукоризненно.',
      guestName: 'Руслан Каримов'
    }
  ]

  let addedReviewsCount = 0
  for (const rd of reviewsData) {
    // Находим завершенное или подтвержденное бронирование этого гостя в комнате нужного типа
    const matchingBooking = createdBookings.find(
      cb => cb.guestName === rd.guestName && cb.typeName === rd.roomType
    )

    if (matchingBooking) {
      await prisma.review.create({
        data: {
          bookingId: matchingBooking.id,
          userId: matchingBooking.guestId,
          rating: rd.rating,
          comment: rd.comment,
          createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 2) // Отзыв оставлен через 2 дня после заезда/выезда
        }
      })
      addedReviewsCount++
    } else {
      // Создаем резервный отзыв, найдя любое завершенное/подтвержденное бронирование для этого типа номера
      const backupBooking = createdBookings.find(
        cb => cb.typeName === rd.roomType && (cb.status === 'COMPLETED' || cb.status === 'CONFIRMED')
      )
      if (backupBooking) {
        // Проверяем, нет ли уже отзыва для этой брони
        const existingReview = await prisma.review.findUnique({
          where: { bookingId: backupBooking.id }
        })

        if (!existingReview) {
          await prisma.review.create({
            data: {
              bookingId: backupBooking.id,
              userId: backupBooking.guestId,
              rating: rd.rating,
              comment: rd.comment,
              createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 2)
            }
          })
          addedReviewsCount++
        }
      }
    }
  }

  console.log(`Успешно добавлено отзывов в базу данных: ${addedReviewsCount}`)
  console.log('--- Сидирование завершено успешно! ---')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
