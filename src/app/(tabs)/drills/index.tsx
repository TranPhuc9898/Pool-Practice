import { RankHero } from '@/components/rank/rank-cards';
import { useLevelSummaries } from '@/components/rank/rank-data';
import { Screen } from '@/design-system';

/**
 * Thư viện drill theo hạng H → PRO: một dòng lớn điền hạng nên tập tiếp tính từ tiến độ thật, dưới là bàn phím mọi hạng.
 * Chọn một hạng thì mở trang của hạng đó với toàn bộ bài, chia theo nhóm kỹ năng.
 */
export default function DrillsScreen() {
  const { summaries, suggested } = useLevelSummaries();
  return (
    <Screen>
      <RankHero summaries={summaries} suggested={suggested} />
    </Screen>
  );
}
