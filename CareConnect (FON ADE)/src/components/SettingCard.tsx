interface SettingCardProps {
  title: string;
  children: React.ReactNode;
}

export function SettingCard({ title, children }: SettingCardProps) {
  return (
    <section 
      className="bg-[#1C2128] rounded-2xl p-6 border-2 border-[#3A3F45]"
      role="region"
      aria-label={title}
    >
      <h2 className="text-white font-bold text-2xl mb-4">{title}</h2>
      {children}
    </section>
  );
}