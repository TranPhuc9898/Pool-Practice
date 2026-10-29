import { useState } from 'react';

import { DemoCard, DemoStatus } from './demo-card';
import { aimCue, Ball, Cue, place, PoolTable, roll, Segment, sink, strike, useBall, useCue, Zone } from './pool-table';
import { add, R, unit, useDemoLoop, wait, type Alive, type Pt } from './timeline';

/**
 * Điều bi từ 1 sang 2. Cú 1 cắt vào lỗ giữa trên, bi cái chạy theo tiếp tuyến vào vùng;
 * từ vùng đó bi 2 thẳng vào lỗ giữa dưới.
 */
const B1: Pt = [300, 80];
const P1: Pt = [260, 14];
const P2: Pt = [260, 266];
const C0: Pt = [380, 110];
const U1 = unit(B1, P1);
const G1 = add(B1, U1, -2 * R); // điểm chạm cú 1
const TAN: Pt = [U1[1], -U1[0]]; // tiếp tuyến, hướng xuống trái
const Z = add(G1, TAN, 110); // giữa vùng
const U2 = unit(Z, P2);
const B2 = add(Z, U2, 60);
const G2 = add(B2, U2, -2 * R);

type Scene = { ball: number; aim: [Pt, Pt] | null; route: boolean; zone: boolean; say: string; pass: boolean };
const START: Scene = { ball: 1, aim: null, route: false, zone: false, say: 'Pot 1, land in the zone', pass: false };

export function PositionArt({ active }: { active: boolean }) {
  const b1 = useBall();
  const b2 = useBall();
  const cb = useBall();
  const cue = useCue();
  const [scene, setScene] = useState<Scene>(START);
  const patch = (p: Partial<Scene>) => setScene((s) => ({ ...s, ...p }));

  const run = async (alive: Alive) => {
    place(b1, B1);
    place(b2, B2);
    place(cb, C0);
    const d1 = unit(C0, G1);
    aimCue(cue, C0, d1, 6);
    setScene(START);
    await wait(900);
    if (!alive()) return;
    patch({ aim: [add(P1, U1, -6), B1], zone: true });
    await wait(500);
    if (!alive()) return;
    patch({ route: true });
    await wait(800);
    if (!alive()) return;
    await strike(cue, C0, d1, alive);
    if (!alive()) return;
    patch({ aim: null });
    await roll(cb, C0, G1, 300, alive);
    await Promise.all([sink(b1, B1, P1, alive, 420), roll(cb, G1, Z, 900, alive)]);
    if (!alive()) return;
    patch({ route: false, say: 'In the zone · Pass', pass: true });
    await wait(1100);
    if (!alive()) return;

    const d2 = unit(Z, G2);
    aimCue(cue, Z, d2, 6);
    patch({ ball: 2, say: 'Ball 2 is now a straight shot', pass: false, aim: [add(P2, U2, 6), Z] });
    await wait(1000);
    if (!alive()) return;
    await strike(cue, Z, d2, alive);
    if (!alive()) return;
    patch({ aim: null });
    await roll(cb, Z, G2, 320, alive);
    await sink(b2, B2, P2, alive);
    if (!alive()) return;
    patch({ say: 'Pass · Table cleared', pass: true });
    await wait(1400);
  };

  useDemoLoop(active, run);

  return (
    <DemoCard
      accessibilityLabel="Demo: pot ball 1 and send the cue ball into the zone, then ball 2 is a straight shot."
      table={
        <PoolTable>
          {scene.route && <Segment a={G1} b={Z} dash={[2, 4]} />}
          {scene.aim && <Segment a={scene.aim[0]} b={scene.aim[1]} dash={[4, 4]} />}
          {scene.zone && <Zone at={Z} r={20} filled />}
          <Ball actor={b1} label="1" />
          <Ball actor={b2} label="2" />
          <Ball actor={cb} cue />
          <Cue actor={cue} />
        </PoolTable>
      }
      footer={<DemoStatus say={scene.say} pass={scene.pass} value={scene.ball} unit="BALL" />}
    />
  );
}
