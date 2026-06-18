import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white border-t border-[#C5A059]/15">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Almaty Grand Hotel</h3>
            <p className="text-slate-400 text-sm">
              Роскошь и комфорт в сердце Алматы. Ваш идеальный отдых начинается здесь.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                г. Алматы, ул. Достык, 85
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +7 (727) 123-45-67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@almatygrand.kz
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                Ресепшн: 24/7
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/rooms" className="text-slate-400 hover:text-white transition-colors">
                  Номера
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-slate-400 hover:text-white transition-colors">
                  Поиск номеров
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-slate-400 hover:text-white transition-colors">
                  Мои бронирования
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                  Частые вопросы
                </Link>
              </li>
              <li className="text-slate-400">Заезд: с 14:00</li>
              <li className="text-slate-400">Выезд: до 12:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C5A059]/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Almaty Grand Hotel. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
