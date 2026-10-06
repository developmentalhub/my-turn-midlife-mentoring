import MyTurnNav from "../../components/MyTurnNav";

export default function MyTurnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <MyTurnNav />

      <div className="lg:pr-[320px]">
        {children}
      </div>
    </div>
  );
}