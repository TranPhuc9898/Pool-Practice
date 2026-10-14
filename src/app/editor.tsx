import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/design-system';
import { drillByNumber } from '@/pool-engine/drills';

import { PoolEditorView, type EditorCommit, type EditorState, type EditorViewMode } from '../../modules/pool-table';

function fromDrill(n: number): EditorState {
  const d = drillByNumber(n)!;
  return {
    rev: 1,
    balls: [{ number: 0, ...d.cueBall }, ...d.objectBalls],
    aimBall: d.objectBalls[0]?.number ?? -1,
    aimPocket: d.targetPocket,
    tipX: 0,
    tipY: 0.4,
    speed: 1.8,
    theta: 0,
  };
}

// Thế 9 bi sau break của bench planner (inch), chỉ để kiểm Gợi ý bằng `?rack=9`.
const RACK9: [number, number, number][] = [
  [0, 28, 52], [1, 10, 18], [2, 38, 12], [3, 22, 34], [4, 44, 46], [5, 6, 58], [6, 30, 62], [7, 16, 80], [8, 40, 86], [9, 26, 24],
];

function rack9(): EditorState {
  return {
    rev: 1,
    balls: RACK9.map(([number, x, y]) => ({ number, x: x / 50, y: y / 100 })),
    aimBall: -1,
    aimPocket: '',
    tipX: 0,
    tipY: 0,
    speed: 1.8,
    theta: 0,
  };
}

type Params = {
  fixture?: string;
  tip?: string;
  tipX?: string;
  speed?: string;
  theta?: string;
  view?: EditorViewMode;
  card?: string;
  rack?: string;
  suggest?: string;
};

export default function EditorScreen() {
  // tip, tipX, speed, theta, view, card, rack, suggest trên URL chỉ để kiểm bằng screenshot, không có trong luồng người dùng.
  const { fixture, tip, tipX, speed, theta, view, card, rack, suggest } = useLocalSearchParams<Params>();
  const [state, setState] = useState<EditorState>(() => (rack === '9' ? rack9() : fromDrill(3)));
  const [seen, setSeen] = useState<{ tip?: string; tipX?: string; speed?: string; theta?: string }>({});
  if (seen.tip !== tip || seen.tipX !== tipX || seen.speed !== speed || seen.theta !== theta) {
    setSeen({ tip, tipX, speed, theta });
    setState((s) => ({
      ...s,
      tipY: tip ? Number(tip) : s.tipY,
      tipX: tipX ? Number(tipX) : s.tipX,
      speed: speed ? Number(speed) : s.speed,
      theta: theta ? Number(theta) : s.theta,
      rev: s.rev + 1,
    }));
  }
  // Thẻ bài là sheet native; nút trên thanh tiêu đề chỉ tăng số để Swift mở.
  const [cardRev, setCardRev] = useState(card ? 1 : 0);
  // Gợi ý chạy bên Swift (planner 9-ball); nút chỉ tăng số như Thẻ bài.
  const [suggestRev, setSuggestRev] = useState(suggest ? 1 : 0);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Đọc nativeEvent ngay: event bị tái dùng sau handler, updater chạy muộn sẽ thấy null.
  const onCommit = ({ nativeEvent }: { nativeEvent: EditorCommit }) => setState((s) => ({ ...nativeEvent, rev: s.rev }));

  return (
    // View native chiếm hết màn: card cao cố định bên Swift, bàn và hai ô hình chia phần còn lại.
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack.Screen
        options={{
          title: 'Shot Editor',
          // Tiêu đề nhỏ 44pt như HTML v4.1, chừa chỗ cho bàn.
          headerLargeTitleEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                icon="wand.and.stars"
                variant="plain"
                accessibilityLabel="Suggest route"
                onPress={() => setSuggestRev((r) => r + 1)}
              />
              <IconButton icon="doc.text" variant="plain" accessibilityLabel="Shot card" onPress={() => setCardRev((r) => r + 1)} />
            </View>
          ),
        }}
      />
      <PoolEditorView
        style={{ flex: 1, width }}
        state={state}
        fixture={fixture}
        view={view}
        cardRev={cardRev}
        suggestRev={suggestRev}
        onCommit={onCommit}
      />
    </View>
  );
}
