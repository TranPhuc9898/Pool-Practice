import { View } from 'react-native';

import type { PoolDrill } from '@/pool-engine/types';

import { PoolTableView } from '../../../modules/pool-table';

/** Bàn ngang: (100" + 2 băng) × (50" + 2 băng), khớp `PoolTableGeometry`. Rộng hơn cao thì native tự xoay ngang. */
const TABLE_ASPECT = 111 / 61;

/**
 * Bàn native thu nhỏ, chỉ để nhìn: không kéo bi, không nhận chạm, để cả card vẫn là một nút.
 * Cùng renderer với màn drill nên hình trên Home khớp hình khi vào tập.
 */
export function TablePreview({ drill }: { drill: PoolDrill }) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: '100%', aspectRatio: TABLE_ASPECT }}>
      <PoolTableView style={{ flex: 1 }} drill={drill} showGhostBall={false} />
    </View>
  );
}
