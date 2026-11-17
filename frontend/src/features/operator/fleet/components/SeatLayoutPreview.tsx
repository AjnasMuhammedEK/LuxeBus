import { useMemo } from "react";
import { DoorOpen, LogOut } from "lucide-react";
import type {
  ISeatLayout,
  IBusSeatLayoutSnapshot,
  ISeat,
  ILayoutElement,
  IDeckConfig,
  SeatType,
} from "@/types/fleet.types";

interface SeatLayoutPreviewProps {
  layout: ISeatLayout | IBusSeatLayoutSnapshot;
}

const GAP = 6;

 
const INK = "#64748b";
const INK_SOFT = "#94a3b8";
const FILL = "#ffffff";
const FILL_SOFT = "#e2e8f0";

const seatLabel: Record<SeatType, string> = {
  SLEEPER: "Sleeper",
  SEMI_SLEEPER: "Semi-sleeper (push-back)",
  SEATER: "Seater",
};

const pixels = (count: number, cell: number) => count * cell + (count - 1) * GAP;
 
const getCellSize = (seats: ISeat[]) => {
  const hasSleeper = seats.some((seat) => seat.type === "SLEEPER");
  const hasOther = seats.some((seat) => seat.type !== "SLEEPER");

  if (hasSleeper && hasOther) return { cellW: 20, cellH: 34 };

  if (hasSleeper && seats.some((seat) => seat.colSpan > seat.rowSpan)) {
    return { cellW: 20, cellH: 62 };
  }

  return { cellW: 36, cellH: 36 };
};

 

interface SeatIconProps {
  w: number;
  h: number;
  number?: string;
}


const SleeperIcon = ({ w, h, number }: SeatIconProps) => {
  const vertical = h > w;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <rect x={1} y={1} width={w - 2} height={h - 2} rx={6} fill={FILL} stroke={INK} strokeWidth={1.4} />

      {vertical ? (
        <rect x={7} y={h - 11} width={w - 14} height={5} rx={2.5} fill={FILL_SOFT} stroke={INK_SOFT} strokeWidth={0.8} />
      ) : (
        <rect x={w - 11} y={6} width={5} height={h - 12} rx={2.5} fill={FILL_SOFT} stroke={INK_SOFT} strokeWidth={0.8} />
      )}

      {number && (
        <text
          x={vertical ? w / 2 : (w - 11) / 2}
          y={vertical ? (h - 12) / 2 : h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={10}
          fontWeight={600}
          fill={INK}
        >
          {number}
        </text>
      )}
    </svg>
  );
};

 
const SeaterIcon = ({ w, h, number }: SeatIconProps) => (
  <svg width={w} height={h} viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet" className="block">
    <g fill={FILL} stroke={INK} strokeWidth={1.5}>
      <rect x={9} y={3} width={22} height={15} rx={4} />
      <rect x={3.5} y={13} width={6} height={21} rx={3} />
      <rect x={30.5} y={13} width={6} height={21} rx={3} />
      <rect x={9} y={20} width={22} height={14} rx={4} />
    </g>
    {number && (
      <text x={20} y={27.5} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill={INK}>
        {number}
      </text>
    )}
  </svg>
);


const SemiSleeperIcon = ({ w, h, number }: SeatIconProps) => (
  <svg width={w} height={h} viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet" className="block">
    <g fill={FILL} stroke={INK} strokeWidth={1.5}>
      <rect x={12} y={1.5} width={16} height={5.5} rx={2.75} fill={FILL_SOFT} />
      <path d="M9 10 Q9 8 11 8 H29 Q31 8 31 10 V21 H9 Z" />
      <rect x={3.5} y={15} width={5.5} height={19} rx={2.75} />
      <rect x={31} y={15} width={5.5} height={19} rx={2.75} />
      <rect x={9} y={22.5} width={22} height={11.5} rx={3.5} />
      <rect x={13} y={36} width={14} height={3} rx={1.5} fill={FILL_SOFT} />
    </g>
    <g fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17.5 Q20 12 25 17.5" />
      <path d="M24.34 14.56 L25 17.5 L22.12 16.6" />
    </g>
    {number && (
      <text x={20} y={28.5} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fontWeight={700} fill={INK}>
        {number}
      </text>
    )}
  </svg>
);

const SeatIcon = ({ type, ...props }: SeatIconProps & { type: SeatType }) => {
  if (type === "SLEEPER") return <SleeperIcon {...props} />;
  if (type === "SEMI_SLEEPER") return <SemiSleeperIcon {...props} />;
  return <SeaterIcon {...props} />;
};



const SteeringWheel = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M2 12h7.5M14.5 12H22M12 14.5V22" />
  </svg>
);

 
const ElementTile = ({ element, narrow }: { element: ILayoutElement; narrow: boolean }) => {
  const base =
    "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md border border-slate-300 bg-slate-100 text-[10px] font-semibold leading-tight text-slate-500";

  switch (element.type) {
    case "DRIVER":
      return (
        <div className="flex h-full w-full items-center justify-center" title="Driver">
          <SteeringWheel />
        </div>
      );
    case "DOOR":
      return (
        <div className={base} title="Door">
          <DoorOpen className="h-3.5 w-3.5" />
          {!narrow && (element.label || "Door")}
        </div>
      );
    case "EMERGENCY_EXIT":
      return (
        <div className={base} title="Emergency exit">
          <LogOut className="h-3.5 w-3.5" />
          {!narrow && "Exit"}
        </div>
      );
    case "TOILET":
      return (
        <div className={base} title="Toilet">
          WC
        </div>
      );
    case "STAIRCASE":
      return (
        <div
          className={base}
          title="Staircase"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 5px, rgba(100,116,139,0.25) 5px 6px)",
          }}
        >
          {!narrow && "Stairs"}
        </div>
      );
    default:
      return null;
  }
};




const gridPosition = (item: ISeat | ILayoutElement) => ({
  gridColumn: `${item.col} / span ${item.colSpan}`,
  gridRow: `${item.row} / span ${item.rowSpan}`,
});

const DeckView = ({
  deck,
  seats,
  elements,
  cellW,
  cellH,
  showWheelInHeader,
}: {
  deck: IDeckConfig;
  seats: ISeat[];
  elements: ILayoutElement[];
  cellW: number;
  cellH: number;
  showWheelInHeader: boolean;
}) => (
  <div className="rounded-2xl bg-slate-50 p-3">
    <div className="mb-3 flex items-center justify-between px-1">
      <h4 className="text-sm font-bold text-slate-800">
        {deck.name === "LOWER" ? "Lower deck" : "Upper deck"}
      </h4>
      {showWheelInHeader && <SteeringWheel size={28} />}
    </div>

    <div className="rounded-2xl border border-slate-300 bg-white p-3">
      <div
        className="grid"
        style={{
          gap: GAP,
          gridTemplateColumns: `repeat(${deck.cols}, ${cellW}px)`,
          gridTemplateRows: `repeat(${deck.rows}, ${cellH}px)`,
        }}
      >
        {elements.map((element) => (
          <div key={element.elementId} style={gridPosition(element)}>
            <ElementTile
              element={element}
              narrow={pixels(element.colSpan, cellW) < 40}
            />
          </div>
        ))}

        {seats.map((seat) => (
          <div
            key={seat.seatId}
            className="flex items-center justify-center"
            style={gridPosition(seat)}
            title={`${seat.seatNumber} · ${seatLabel[seat.type]}`}
          >
            <SeatIcon
              type={seat.type}
              w={pixels(seat.colSpan, cellW)}
              h={pixels(seat.rowSpan, cellH)}
              number={seat.seatNumber}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

 

const SeatLayoutPreview = ({ layout }: SeatLayoutPreviewProps) => {
  const counts = useMemo(() => {
    const result: Record<SeatType, number> = { SLEEPER: 0, SEMI_SLEEPER: 0, SEATER: 0 };
    layout.seats.forEach((seat) => {
      result[seat.type] += 1;
    });
    return result;
  }, [layout.seats]);

  const { cellW, cellH } = useMemo(() => getCellSize(layout.seats), [layout.seats]);

   const decks = useMemo(
    () =>
      [...layout.decks].sort((a, b) =>
        a.name === b.name ? 0 : a.name === "LOWER" ? -1 : 1
      ),
    [layout.decks]
  );

  const lowerHasDriver = layout.elements.some(
    (element) => element.type === "DRIVER" && element.deck === "LOWER"
  );

  const legendTypes = (Object.keys(seatLabel) as SeatType[]).filter(
    (type) => counts[type] > 0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">{layout.name}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {layout.busType.replaceAll("_", " ")} · {layout.totalCapacity} seats / berths ·{" "}
          {layout.decks.length} deck{layout.decks.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-4 overflow-x-auto">
        {decks.map((deck) => (
          <DeckView
            key={deck.name}
            deck={deck}
            seats={layout.seats.filter((seat) => seat.deck === deck.name)}
            elements={layout.elements.filter((element) => element.deck === deck.name)}
            cellW={cellW}
            cellH={cellH}
            showWheelInHeader={deck.name === "LOWER" && !lowerHasDriver}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-3">
        {legendTypes.map((type) => (
          <span key={type} className="inline-flex items-center gap-2 text-[11px] text-slate-600">
            <SeatIcon
              type={type}
              w={type === "SLEEPER" ? 22 : 24}
              h={type === "SLEEPER" ? 30 : 24}
            />
            {seatLabel[type]} ({counts[type]})
          </span>
        ))}

        {layout.elements.some((e) => e.type === "EMERGENCY_EXIT") && (
          <span className="inline-flex items-center gap-2 text-[11px] text-slate-600">
            <LogOut className="h-3.5 w-3.5 text-slate-500" /> Emergency exit
          </span>
        )}
        {layout.elements.some((e) => e.type === "TOILET") && (
          <span className="inline-flex items-center gap-2 text-[11px] text-slate-600">
            <span className="rounded border border-slate-300 bg-slate-100 px-1 text-[10px] font-semibold text-slate-500">
              WC
            </span>
            Toilet
          </span>
        )}
        {layout.elements.some((e) => e.type === "DOOR") && (
          <span className="inline-flex items-center gap-2 text-[11px] text-slate-600">
            <DoorOpen className="h-3.5 w-3.5 text-slate-500" /> Door
          </span>
        )}
      </div>
    </div>
  );
};

export default SeatLayoutPreview;