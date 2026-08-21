import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/size-guide")({
  component: SizeGuide,
  head: () => ({ meta: [{ title: "Size guide — Urban Piranha" }] }),
});

function SizeGuide() {
  return (
    <ShopPage kicker="Fit" title="Size guide">
      <p>Tees are a boxy street cut. If you sit between sizes, size up.</p>
      <div className="overflow-x-auto rounded-2xl border border-up-line bg-white">
        <table className="w-full min-w-[28rem] text-left text-sm text-up-ink">
          <thead className="bg-up-mist text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Chest</th>
              <th className="px-4 py-3">Length</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["S", "36–38 in", "27 in"],
              ["M", "38–40 in", "28 in"],
              ["L", "42–44 in", "29 in"],
              ["XL", "46–48 in", "30 in"],
              ["XXL", "50–52 in", "31 in"],
            ].map((row) => (
              <tr key={row[0]} className="border-t border-up-line">
                {row.map((c) => (
                  <td key={c} className="px-4 py-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>59FIFTYs are fitted, one size in this drop (OS). Decks and print are OS.</p>
    </ShopPage>
  );
}
