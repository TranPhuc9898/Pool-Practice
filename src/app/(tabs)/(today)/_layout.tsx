import { TabStack } from '@/components/tab-stack';

/** Header native trong suốt, không title: giữ scroll-edge blur dưới status bar, nút nằm ở headerRight (glass). */
export default function Layout() {
  return <TabStack title="Today" rootOptions={{ headerLargeTitleEnabled: false, headerTitle: '' }} />;
}
