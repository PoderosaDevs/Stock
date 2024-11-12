import { Header } from "../../components/Header";
import { TableHome } from "./partials/table";
import { Report } from "./partials/report";
import { SummaryHome } from "../../components/Summary";

export function Home() {
  return (
    <>
      <Header />

      <div className="max-w-[1500px] font-body h-full px-8 pt-24 bg-[#f6f6f6] mx-auto">
        <SummaryHome />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 md:col-span-2 bg-white px-8 py-6 rounded-2xl shadow-md h-auto">
            <TableHome />
          </div>
          {/* Segundo card com largura de 30% em telas médias e maiores */}
          <div className="col-span-1 md:col-span-1 bg-white px-8 py-6 rounded-2xl shadow-md h-auto">
            <Report />
          </div>
        </div>
      </div>

    </>
  )
}