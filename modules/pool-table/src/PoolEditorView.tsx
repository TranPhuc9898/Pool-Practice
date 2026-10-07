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
  /** Đầu cơ theo bán kính bi, dương là cao. */
  tip: number;
  /** Tốc độ bi cái lúc rời đầu cơ, m/s. */
  speed: number;
};

/** Bản chụp lúc nhấc tay. Không có `rev`. */
export type EditorCommit = Omit<EditorState, 'rev'>;

export type PoolEditorViewProps = ViewProps & {
  state: EditorState;
  /** Chỉ để kiểm: `d03` thì Swift NSLog ba cú mẫu của Drill 03 lúc mở. */
  fixture?: string;
  onCommit?: (event: { nativeEvent: EditorCommit }) => void;
};

export const PoolEditorView = requireNativeView<PoolEditorViewProps>('PoolTable', 'PoolEditorView');
