import React from "react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <div className="bg-[#f8f5ff] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-[#eaddf7] relative overflow-hidden mt-8">
      {/* Decorative elements - Left */}
      <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-[#eaddf7] shrink-0 mr-4 z-10">
        <CalendarCheck size={20} className="text-[#47295C]" strokeWidth={2} />
      </div>

      <div className="flex-1 z-10 text-center md:text-left mb-4 md:mb-0">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Votre temps. Votre impact.</h3>
        <p className="text-gray-600 text-xs max-w-2xl leading-relaxed">
          En gardant vos disponibilités à jour, vous donnez à plus de startups la chance de bénéficier de votre expertise.
        </p>
      </div>

      <div className="z-10 shrink-0">
        <Link href="/espace-mentor/disponibilites" className="flex items-center justify-center gap-2 bg-[#47295C] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#5a3875] transition-colors text-xs shadow-md">
          Mettre à jour mes disponibilités
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Decorative background illustrations (simulated with shapes) */}
      <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
        <div className="w-32 h-32 bg-[#47295C] rounded-full blur-3xl -mr-10 -mb-10"></div>
      </div>
    </div>
  );
}
