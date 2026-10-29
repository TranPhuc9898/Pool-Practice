import { useState } from 'react';

import { DemoCard, DemoStatus } from './demo-card';
import { aimCue, Ball, Cue, place, PoolTable, roll, Segment, sink, strike, useBall, useCue, Zone } from './pool-table';
import { add, R, useDemoLoop, wait, type Alive, type Pt } from './timeline';

/**
 * Cú Stop vào lỗ giữa trên: ba nấc thẳng 1→3 diamond, rồi hai cú xiên khó hơn.
 * Bi cái, bi mục tiêu, lỗ luôn thẳng hàng nên bi cái vẫn dừng chết được.
 */
const POCKET: Pt = [260, 14];
const OB_GAP = 46;
const D = 60;
const STEPS = [
  { deg: 0, k: 1, say: 'Stop shot', twice: true },
  { deg: 0, k: 2, say: 'One diamond back', twice: true },
  { deg: 0, k: 3, say: 'One diamond back', twice: true },
  { deg: -24, k: 2, say: 'Harder · off the straight line', twice: false },
  { deg: 30, k: 3, say: 'Harder · steep angle, 3 diamonds', twice: false },
];

type Scene = {
  k: number;
  ticks: [Pt, Pt][];
  aim: [Pt, Pt] | null;
  zone: Pt | null;
  say: string;
  pass: boolean;
};

export function LadderArt({ active }: { active: boolean }) {
  const ob = useBall();
  const cb = useBall();
  const cue = useCue();
  const [scene, setScene] = useState<Scene>({ k: 1, ticks: [], aim: null, zone: null, say: STEPS[0].say, pass: false });

  const run = async (alive: Alive) => {
    for (const step of STEPS) {
      const r = (step.deg * Math.PI) / 180;
      const back: Pt = [Math.sin(r), Math.cos(r)];
      const fwd: Pt = [-back[0], -back[1]];
      const O = add(POCKET, back, OB_GAP);
      const C = add(O, back, D * step.k);
      const hit = add(O, back, 2 * R);
      // Thước diamond chạy song song đường bắn, lệch sang bên 20pt.
      const side: Pt = [back[1] * 20, -back[0] * 20];
      const across: Pt = [back[1], -back[0]];
      const ticks: [Pt, Pt][] = Array.from({ length: step.k }, (_, i) => {
        const p = add(add(O, back, D * (i + 1)), side);
        return [add(p, across, -4), add(p, across, 4)];
      });
      ticks.push([add(O, side), add(C, side)]);

      place(ob, O);
      place(cb, C);
      aimCue(cue, C, fwd, 6);
      setScene({ k: step.k, ticks, aim: null, zone: null, say: step.say, pass: false });
      await wait(900);
      if (!alive()) return;
      setScene((s) => ({ ...s, aim: [add(POCKET, back, 6), C], zone: hit }));
      await wait(700);
      if (!alive()) return;
      await strike(cue, C, fwd, alive);
      if (!alive()) return;
      setScene((s) => ({ ...s, aim: null }));
      await roll(cb, C, hit, 420, alive);
      await sink(ob, O, POCKET, alive);
      if (!alive()) return;
      setScene((s) => ({ ...s, say: 'Dead stop · Pass', pass: true }));
      await wait(900);
      if (!alive()) return;
      if (step.twice) {
        setScene((s) => ({ ...s, say: 'Pass · Pass' }));
        await wait(900);
        if (!alive()) return;
      }
    }
  };

  useDemoLoop(active, run);

  return (
    <DemoCard
      accessibilityLabel="Demo: stop the cue ball dead after potting. Two in a row moves the cue ball one diamond farther back."
      table={
        <PoolTable>
          {scene.ticks.map(([a, b], i) => (
            <Segment key={i} a={a} b={b} tone="tick" />
          ))}
          {scene.aim && <Segment a={scene.aim[0]} b={scene.aim[1]} dash={[4, 4]} />}
          {scene.zone && <Zone at={scene.zone} r={13} />}
          <Ball actor={ob} />
          <Ball actor={cb} cue />
          <Cue actor={cue} />
        </PoolTable>
      }
      footer={
        <DemoStatus
          say={scene.say}
          pass={scene.pass}
          value={scene.k}
          unit={scene.k === 1 ? 'DIAMOND AWAY' : 'DIAMONDS AWAY'}
        />
      }
    />
  );
}
