import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

/**
 * Trạng thái camera, khớp `PoseCoach.swift`. `ready` là thấy đủ vai, khuỷu, cổ tay; `address` là cổ tay đứng yên
 * lúc cúi vào bàn; `stroke` là đang lùi, đưa lên hoặc follow-through.
 */
export type PoseState = 'denied' | 'unavailable' | 'searching' | 'tilted' | 'ready' | 'address' | 'stroke';

export type PoseStatus = {
  state: PoseState;
  /** Máy ngả trước sau, độ. Quá 12 là không đo. */
  tilt: number;
  /** Cẳng tay so với phương dọc, độ, dương là cổ tay ra trước khuỷu. Không có khi không thấy tay. */
  forearm?: number;
};

/** Lỗi đầu tiên theo thứ tự cẳng tay → khuỷu → đầu → dừng sau. */
export type PoseFault = 'good' | 'forearmForward' | 'forearmBack' | 'elbow' | 'head' | 'pause';

export type PoseStroke = {
  /** Độ, cùng quy ước `PoseStatus.forearm`. */
  forearmAddress: number;
  forearmContact: number;
  /** Bắp tay đổi góc từ address tới lúc chạm, độ. */
  elbowDrift: number;
  /** cm, quy từ cẳng tay 26 cm. Không có khi Vision không thấy mũi. */
  headLift?: number;
  /** Giây. */
  backPause: number;
  /** Góc gối chân sau lúc address, 180 là thẳng. Không có khi bàn che chân. */
  backKnee?: number;
  fault: PoseFault;
};

export type PoseVoiceMode = 'vi' | 'en' | 'beep' | 'off';

export type PoseCoachViewProps = ViewProps & {
  /** Tay cầm cơ. Máy đặt bên hông phía tay này. */
  hand?: 'right' | 'left';
  voice?: PoseVoiceMode;
  onStatus?: (event: { nativeEvent: PoseStatus }) => void;
  onStroke?: (event: { nativeEvent: PoseStroke }) => void;
};

export const PoseCoachView = requireNativeView<PoseCoachViewProps>('PoolTable', 'PoseCoachView');
