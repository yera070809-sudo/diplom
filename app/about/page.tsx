import Link from "next/link"
import Image from "next/image"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Utensils,
  Dumbbell,
  Waves,
  Mountain,
  Car,
  Sparkles,
  Shield,
  Gem,
  Heart,
  ConciergeBell
} from "lucide-react"

export const metadata = {
  title: "О нас | Almaty Grand Hotel",
  description: "Узнайте больше об истории, ценностях и пятизвездочном сервисе Almaty Grand Hotel. Искусство роскоши и казахского гостеприимства.",
}

const prisma = new PrismaClient()

async function getSettings() {
  try {
    const list = await prisma.setting.findMany()
    return list.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    console.error("Error fetching settings in about page:", error)
    return {}
  }
}

const values = [
  {
    icon: Heart,
    title: "Традиции Гостеприимства",
    desc: "Мы объединяем душевное тепло казахской культуры с высочайшими международными стандартами сервиса, создавая атмосферу искренней заботы."
  },
  {
    icon: Sparkles,
    title: "Безупречная Роскошь",
    desc: "Каждая деталь интерьера — от натурального мрамора до авторских элементов декора — подобрана для создания ощущения исключительности."
  },
  {
    icon: Shield,
    title: "Абсолютная Безопасность",
    desc: "Современные системы безопасности, конфиденциальность и круглосуточная поддержка обеспечивают нашим гостям полное спокойствие."
  },
  {
    icon: Gem,
    title: "Индивидуальный Подход",
    desc: "Служба личных консьержей готова выполнить любое поручение — от бронирования вертолета до организации приватной экскурсии."
  }
]

const services = [
  {
    icon: Utensils,
    title: "Гастрономия Grand Reserve",
    desc: "Панорамный ресторан авторской кухни под руководством шеф-повара из Франции. Интерпретация традиционных казахских блюд в стиле высокой кухни."
  },
  {
    icon: Waves,
    title: "Aura Spa & Wellness",
    desc: "Уникальное спа-пространство: 25-метровый бассейн с подогревом, финская сауна, хаммам и эксклюзивные массажные ритуалы с органической косметикой."
  },
  {
    icon: Dumbbell,
    title: "Фитнес-Центр 24/7",
    desc: "Зал, оборудованный тренажерами последнего поколения Technogym, индивидуальные тренировки с сертифицированными тренерами и йога-студия."
  },
  {
    icon: ConciergeBell,
    title: "Представительский Сервис",
    desc: "Круглосуточный консьерж-сервис, премиальный трансфер на автомобилях Mercedes S-Class и V-Class, а также доступ в закрытый VIP-лаундж."
  },
  {
    icon: Mountain,
    title: "Панорама Алатау",
    desc: "Большинство наших номеров имеют панорамное остекление с захватывающими видами на вершины Заилийского Алатау, меняющими свой облик в лучах солнца."
  },
  {
    icon: Car,
    title: "Охраняемый Паркинг",
    desc: "Подземный и наземный паркинг с системой видеонаблюдения, зарядными станциями для электромобилей и услугой Valet-парковки."
  }
]

export default async function AboutPage() {
  const settings = await getSettings()

  // Dynamic values with fallbacks
  const hotelPhone = settings.hotel_phone || "+7 (727) 123-45-67"
  const hotelEmail = settings.hotel_email || "info@almatygrand.kz"
  const hotelAddress = settings.hotel_address || "Республика Казахстан, г. Алматы, ул. Достык, 85, почтовый индекс 050010"
  const hotelMapIframe = settings.hotel_map_iframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.6244888544513!2d76.94541491549386!3d43.23812977913709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836eb0f1f66b7d%3A0x2c5c5e5c5c5c5c5c!2z0YPQuy4g0JTQvtGB0YLRi9C6LCDQkNC70LzQsNGC0YssINCa0LDQt9Cw0YXRgdGC0LDQvQ"
  
  const aboutHeroTitle = settings.about_hero_title || "Искусство Роскоши и Гостеприимства"
  const aboutHeroSubtitle = settings.about_hero_subtitle || "С 2010 года Almaty Grand Hotel является символом безупречного сервиса, утонченности и комфорта в самом сердце южной столицы Казахстана."
  
  const aboutPhilosophyTitle = settings.about_philosophy_title || "Где Величественные Горы Встречаются с Современной Элегантностью"
  const aboutPhilosophyText1 = settings.about_philosophy_text_1 || "Almaty Grand Hotel расположен в историческом и культурном центре города, у самого подножия величественных вершин Заилийского Алатау. Мы создали пространство, в котором гармонично сочетаются ритм современного мегаполиса и умиротворение горной природы."
  const aboutPhilosophyText2 = settings.about_philosophy_text_2 || "Каждый гость для нас — это особая история. За 15 лет работы мы завоевали репутацию одного из лучших отелей Казахстана, став домом для глав государств, деятелей искусства и взыскательных путешественников со всего мира."
  const aboutPhilosophyText3 = settings.about_philosophy_text_3 || "Наша главная ценность — предвосхищать ваши ожидания. Мы уделяем внимание мельчайшим деталям, чтобы каждый момент вашего пребывания был наполнен абсолютным комфортом."

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2000"
            alt="Almaty Grand Hotel Exterior"
            fill
            priority
            className="object-cover animate-ken-burns"
          />
        </div>

        <div className="relative z-20 text-center container-premium max-w-4xl mx-auto px-6 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-md uppercase tracking-wider">
            Пятизвездочный Отель в Алматы
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {aboutHeroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            {aboutHeroSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="h-5 w-5 fill-[#C5A059] text-[#C5A059]" />
            ))}
            <span className="ml-2 text-gray-300 font-medium">LUXURY COLLECTION</span>
          </div>
        </div>
      </section>

      {/* History & Philosophy Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Наша Философия</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {aboutPhilosophyTitle}
              </h2>
              <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>{aboutPhilosophyText1}</p>
                <p>{aboutPhilosophyText2}</p>
                <p>{aboutPhilosophyText3}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t">
                <div>
                  <div className="text-3xl font-bold text-[#C5A059]">120+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Роскошных номеров</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#C5A059]">15 лет</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Премиум сервиса</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#C5A059]">98%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Довольных гостей</div>
                </div>
              </div>
            </div>

            {/* Stunning image showing mountain reflection pool */}
            <div className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200"
                alt="Luxury Hotel Room with mountain view"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm uppercase tracking-widest text-[#C5A059] font-bold mb-1">Вид из окон</p>
                <p className="text-2xl font-bold">Величественные вершины Заилийского Алатау</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3">Наши Ценности</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Что Делает Нас Исключительными</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Spaces & Services */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3">Услуги Премиум-Класса</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ваше Пребывание Без Забот</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <Card key={i} className="border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 rounded-2xl">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#C5A059] border border-gray-100">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-gray-50" id="contacts">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3">Контакты</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Всегда на Связи</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Contact Details Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-[#C5A059]/10 p-3 rounded-xl text-[#C5A059]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Наш Адрес</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {hotelAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-[#C5A059]/10 p-3 rounded-xl text-[#C5A059]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Телефоны</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {hotelPhone}<br />
                      +7 (727) 123-45-68<br />
                      <span className="text-xs text-[#C5A059] font-semibold uppercase tracking-wider">Круглосуточно</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-[#C5A059]/10 p-3 rounded-xl text-[#C5A059]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Электронная Почта</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {hotelEmail}<br />
                      booking@almatygrand.kz
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-[#C5A059]/10 p-3 rounded-xl text-[#C5A059]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Режимы Работы</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Служба приема и размещения: <span className="font-semibold text-gray-900">24/7</span><br />
                      Ресторан: <span className="font-semibold text-gray-900">07:00 - 23:00</span><br />
                      Спа-центр: <span className="font-semibold text-gray-900">09:00 - 22:00</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Google Map */}
            <div className="lg:col-span-2 relative h-[520px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <iframe
                src={hotelMapIframe}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/80 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000"
            alt="Luxury lobby background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">Окунитесь в Атмосферу Роскоши</h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Выберите идеальный номер для вашего незабываемого отдыха у подножия гор Заилийского Алатау.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/rooms">
              <Button size="lg" className="bg-[var(--accent)] text-zinc-950 hover:bg-[#B39049] transition-colors h-14 px-8 rounded-full text-base font-semibold">
                Выбрать номер
              </Button>
            </Link>
            <Link href={`tel:${hotelPhone.replace(/[\s\(\)-]/g, "")}`}>
              <Button size="lg" variant="outline" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-14 px-8 rounded-full text-base font-semibold backdrop-blur-sm transition-all">
                <Phone className="h-4 w-4 mr-2" />
                Связаться с отделом бронирования
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
