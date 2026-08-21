import { Suspense, useEffect, useState, type ComponentType } from "react";

export function HatViewer() {
  const [View, setView] = useState<ComponentType | null>(null);

  useEffect(() => {
    let live = true;
    import("./Hat3D").then((m) => {
      if (live) setView(() => m.default);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!View) {
    return (
      <div className="grid aspect-4/5 place-items-center rounded-2xl border border-up-line bg-black text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
        Loading 3D
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="grid aspect-4/5 place-items-center rounded-2xl border border-up-line bg-black text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
          Loading 3D
        </div>
      }
    >
      <View />
    </Suspense>
  );
}
