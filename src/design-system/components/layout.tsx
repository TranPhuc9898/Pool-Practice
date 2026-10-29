import { Children, Fragment, type ReactNode } from 'react';
import { ScrollView, useWindowDimensions, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles, useTheme } from '../theme';
import type { SpacingToken } from '../tokens/scale';
import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

/** Gutter theo bề ngang thật, không theo một đời iPhone. */
export function useGutter() {
  const t = useTheme();
  const { width } = useWindowDimensions();
  if (width < t.layout.compactBreakpoint) return t.layout.gutterCompact;
  if (width >= t.layout.largeBreakpoint) return t.layout.gutterLarge;
  return t.layout.gutter;
}

type ScreenProps = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  children: ReactNode;
  /** Khoảng cách dọc giữa các khối con. */
  gap?: SpacingToken;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Khung cuộn chuẩn: gutter, max width cho iPad, inset tự động dưới header trong suốt + tab bar.
 */
export function Screen({ children, gap = 'xxl', contentStyle, ...rest }: ScreenProps) {
  const t = useTheme();
  const s = useStyles();
  const gutter = useGutter();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="interactive"
      style={s.scroll}
      contentContainerStyle={[s.content, { paddingHorizontal: gutter }]}
      {...rest}>
      <View style={[s.inner, { gap: t.space[gap] }, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

type SectionProps = {
  title?: string;
  caption?: string;
  /** Phần tử nhỏ trước tiêu đề, ví dụ `RankBadge`. */
  leading?: ReactNode;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
  gap?: SpacingToken;
};

export function Section({ title, caption, leading, action, children, gap = 'sm' }: SectionProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={{ gap: t.space[gap] }}>
      {(title || action) && (
        <View style={s.sectionHeader}>
          {leading}
          <View style={s.flex}>
            {title && (
              <AppText variant="title3" accessibilityRole="header">
                {title}
              </AppText>
            )}
            {caption && (
              <AppText variant="caption" color="textTertiary">
                {caption}
              </AppText>
            )}
          </View>
          {action && (
            <PressableScale onPress={action.onPress} accessibilityRole="button" style={s.action}>
              <AppText variant="callout" color="accentContent">
                {action.label}
              </AppText>
            </PressableScale>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

/** Nhóm dòng kiểu Settings: một khung, divider mảnh giữa các dòng (không divider ở mép). */
export function ListGroup({ children }: { children: ReactNode }) {
  const s = useStyles();
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={s.group}>
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <View style={s.divider} />}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

/** Lưới cột đều — cho StatCard. */
export function Grid({ columns = 2, children }: { columns?: number; children: ReactNode }) {
  const t = useTheme();
  const items = Children.toArray(children);
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <View style={{ gap: t.space.sm }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: t.space.sm }}>
          {row.map((item, c) => (
            <View key={c} style={{ flex: 1 }}>
              {item}
            </View>
          ))}
          {Array.from({ length: columns - row.length }, (_, k) => (
            <View key={`pad-${k}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: t.color.backgroundPrimary },
  content: { paddingTop: t.space.xs, paddingBottom: t.space.section, alignItems: 'center' },
  inner: { width: '100%', maxWidth: t.layout.maxContentWidth },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
  action: { minHeight: t.layout.minTouchTarget, justifyContent: 'center' },
  group: {
    borderRadius: t.radius.large,
    borderCurve: 'continuous',
    backgroundColor: t.color.surfacePrimary,
    borderWidth: t.border.normal,
    borderColor: t.color.borderSubtle,
    overflow: 'hidden',
  },
  divider: {
    height: t.border.hairline,
    backgroundColor: t.color.borderPrimary,
    marginLeft: t.space.md,
  },
}));
