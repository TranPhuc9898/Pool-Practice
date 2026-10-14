import { TabStack } from "@/components/tab-stack";
import { useTheme } from "@/design-system";

/**
 * Large title native như Drills: cuộn lên là iOS tự co "Today" vào giữa header theo từng pixel.
 * Chữ to giữ chất Doto gold của Home; chữ nhỏ khi co dùng style chung, trùng "Drills".
 */
export default function Layout() {
  const t = useTheme();
  return (
    <TabStack
      title="Today"
      rootOptions={{
        headerLargeTitleStyle: {
          fontFamily: t.type.dotDisplay.fontFamily,
          color: t.color.accentGold,
        },
      }}
    />
  );
}
