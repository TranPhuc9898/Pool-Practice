import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/be-vietnam-pro';
import { Doto_900Black } from '@expo-google-fonts/doto';

/**
 * Đổi font: đổi import ở đây + `fontFamily` trong tokens/typography.ts.
 * Native (Swift) gọi cùng các file này qua PostScript name: `BeVietnamPro-Medium`, `Doto-Black`.
 */
export function useAppFonts() {
  const [loaded, error] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
    Doto_900Black,
  });
  return loaded || error != null;
}
