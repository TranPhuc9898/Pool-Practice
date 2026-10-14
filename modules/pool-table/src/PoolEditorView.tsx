import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

import type { NativeBall, NativeDrill } from './PoolTableView';

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

/** Màn drill: cú đưa bi cái tới vùng đích vừa chạm, dò bằng mô phỏng. `label` rỗng là bỏ chọn, `found` false là không cú nào sạch. */
export type TargetPick = {
  label: string;
  found?: boolean;
  /** Đầu cơ theo bán kính bi, cùng quy ước `EditorState`. */
  tipX?: number;
  tipY?: number;
  /** m/s. */
  speed?: number;
  /** Chỗ dừng cách tâm vùng, inch. */
  miss?: number;
  inZone?: boolean;
  /** Drill chạy bàn: cú đang đánh trong chuỗi, `label` là bi mục tiêu, không có vùng đích. */
  runout?: boolean;
};

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
  /** Màn drill: chỉ còn bàn dọc và hai ô Ngắm / Dày mỏng, không khay, không bảng cú, không kéo bi. */
  stageOnly?: boolean;
  /** Màn drill: vẽ vùng đích và guide của drill thay cho nét dự đoán của editor. */
  drill?: NativeDrill;
  showGhostBall?: boolean;
  showTangentLine?: boolean;
  showCuePath?: boolean;
  showTarget?: boolean;
  /** Màn drill: tăng mỗi lần bấm Play shot; Swift chạy cú đang hiện khi số đổi. */
  playRev?: number;
  onTargetPick?: (event: { nativeEvent: TargetPick }) => void;
};

export const PoolEditorView = requireNativeView<PoolEditorViewProps>('PoolTable', 'PoolEditorView');
