import React from "react";
import { StartupProfile } from "@/lib/data/startups";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function ProfileContact({ startup }: { startup: StartupProfile }) {
  return (
    <div className="w-full bg-gray-50/50 border border-gray-100 rounded-3xl p-8 md:p-12">
      
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-3">
          <Mail className="text-[#964594]" size={24} />
          <h3 className="font-serif font-bold text-lg text-[#47295C]">Contact</h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-md">
          Vous souhaitez en savoir plus ou collaborer avec {startup.name} ? 
          N'hésitez pas à nous contacter.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          <div className="flex items-center gap-3">
            <Mail className="text-[#964594]" size={18} />
            <a href={`mailto:${startup.contact.email}`} className="text-sm font-medium text-gray-600 hover:text-[#964594] transition-colors">
              {startup.contact.email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-[#964594]" size={18} />
            <a href={`tel:${startup.contact.phone.replace(/\s+/g, '')}`} className="text-sm font-medium text-gray-600 hover:text-[#964594] transition-colors">
              {startup.contact.phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-[#964594]" size={18} />
            <span className="text-sm font-medium text-gray-600">
              {startup.contact.location}
            </span>
          </div>
        </div>

        <a 
          href={`mailto:${startup.contact.email}`} 
          className="px-6 py-3 rounded-md border border-[#964594] text-xs font-bold tracking-wide text-[#964594] hover:bg-[#964594] hover:text-white transition-colors flex items-center gap-2 group w-full md:w-auto justify-center md:justify-start mt-4 md:mt-0"
        >
          Contacter l'équipe
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>

      </div>

    </div>
  );
}
