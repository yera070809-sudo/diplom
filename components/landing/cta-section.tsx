"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main CTA Block */}
      <div className="py-32 relative">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000)'
            }}
          />
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
          {/* Gold accent light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A059]/[0.04] rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="container-premium max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-6"
          >
            Начните своё путешествие
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight leading-[1.1]"
          >
            Готовы к{" "}
            <span className="italic text-[#C5A059]">незабываемому</span>
            <br />
            отдыху?
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Забронируйте номер прямо сейчас и откройте для себя мир привилегий, 
            где каждая деталь создана для вашего комфорта.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/rooms">
              <Button size="lg" className="btn-gold h-14 px-10 text-base rounded-full group shadow-[0_10px_40px_-10px_rgba(197,160,89,0.3)]">
                Забронировать сейчас
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base rounded-full bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all"
              >
                Узнать больше
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Strip */}
      <div className="bg-[#0E0E0E] border-t border-white/[0.04]">
        <div className="container-premium max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 py-8 md:pr-8"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/15 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-1">Телефон</p>
                <p className="text-white font-medium text-sm">+7 (727) 123-45-67</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 py-8 md:px-8"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/15 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-1">Email</p>
                <p className="text-white font-medium text-sm">info@almatygrand.kz</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 py-8 md:pl-8"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-1">Адрес</p>
                <p className="text-white font-medium text-sm">г. Алматы, ул. Достык, 85</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
