import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/design-system';
import { drillByNumber } from '@/pool-engine/drills';

import { PoolEditorView, type EditorCommit, type EditorState } from '../../modules/pool-table';

/** Tổng cả băng: 61" × 111", cùng tỉ lệ khung với màn drill. */
const TABLE_ASPECT = 111 / 61;
/** Bảng cú đánh native nằm dưới bàn, trong cùng view. Trùng `PoolShotPanel.height`. */
const PANEL = 184;

function fromDrill(n: number): EditorState {
  const d = drillByNumber(n)!;
  return {
    rev: 1,
    balls: [{ number: 0, ...d.cueBall }, ...d.objectBalls],
    aimBall: d.objectBalls[0]?.number ?? -1,
    aimPocket: d.targetPocket,
    tip: 0.4,
    speed: 1.8,
  };
}

export default function EditorScreen() {
  // tip, speed trên URL chỉ để kiểm guide khi chưa có bảng cú đánh.
  const { fixture, tip, speed } = useLocalSearchParams<{ fixture?: string; tip?: string; speed?: string }>();
  const [state, setState] = useState<EditorState>(() => fromDrill(3));
  const [seen, setSeen] = useState<{ tip?: string; speed?: string }>({});
  if (seen.tip !== tip || seen.speed !== speed) {
    setSeen({ tip, speed });
    setState((s) => ({ ...s, tip: tip ? Number(tip) : s.tip, speed: speed ? Number(speed) : s.speed, rev: s.rev + 1 }));
  }
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Bàn cao nhất có thể mà vẫn chừa chỗ cho bảng, không rộng quá màn.
  const h = Math.min(height - insets.top - 44 - insets.bottom - PANEL, width * TABLE_ASPECT);
  const w = h / TABLE_ASPECT;

  // Đọc nativeEvent ngay: event bị tái dùng sau handler, updater chạy muộn sẽ thấy null.
  const onCommit = ({ nativeEvent }: { nativeEvent: EditorCommit }) => setState((s) => ({ ...nativeEvent, rev: s.rev }));

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Stack.Screen options={{ title: 'Soạn bài' }} />
      <PoolEditorView style={{ width: w, height: h + PANEL }} state={state} fixture={fixture} onCommit={onCommit} />
      <AppText numberOfLines={3} style={{ fontVariant: ['tabular-nums'], fontSize: 11, opacity: 0.7, padding: 8 }}>
        {JSON.stringify(state.balls)}
      </AppText>
    </View>
  );
}
