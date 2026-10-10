import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

import type { NativeBall } from './PoolTableView';

/**
 * State của editor, khớp `EditorStateRecord` bên Swift (`ios/Editor/PoolEditorModel.swift`).
 * `rev` chỉ JS tăng (mở bài, undo, redo); Swift chỉ đọc lại state khi `rev` đổi.
 */
export type EditorState = {
  rev: number;
  balls: readonly NativeBall[];
  /** -1 là chưa có đường vào lỗ. */
  aimBall: number;
  aimPocket: string;
  /** Đầu cơ theo bán kính bi: `tipX` dương là phê phải, `tipY` dương là cao. */
  tipX: number;
  tipY: number;
  /** Tốc độ bi cái lúc rời đầu cơ, m/s. */
  speed: number;
  /** Nâng cơ, độ, 0–75. Trên 0 là massé. */
  theta: number;
};

/** Bản chụp lúc nhấc tay. Không có `rev`. */
export type EditorCommit = Omit<EditorState, 'rev'>;

/** Ba góc nhìn của cùng một cú, khớp `EditorViewMode` bên Swift. */
export type EditorViewMode = 'table' | 'top' | 'back';

export type PoolEditorViewProps = ViewProps & {
  state: EditorState;
  /** Chỉ để kiểm: `d03` thì Swift NSLog bốn cú mẫu của Drill 03 lúc mở. */
  fixture?: string;
  /** Chỉ để kiểm: mở thẳng một góc nhìn lúc mở màn. Người dùng đổi bằng segmented trong view. */
  view?: EditorViewMode;
  /** Tăng mỗi lần bấm "Thẻ bài" trên thanh tiêu đề; Swift mở sheet khi số đổi. */
  cardRev?: number;
  /** Tăng mỗi lần bấm "Gợi ý" trên thanh tiêu đề; Swift chạy planner 9-ball khi số đổi. */
  suggestRev?: number;
  onCommit?: (event: { nativeEvent: EditorCommit }) => void;
};

export const PoolEditorView = requireNativeView<PoolEditorViewProps>('PoolTable', 'PoolEditorView');
