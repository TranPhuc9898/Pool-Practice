import { Stack } from 'expo-router';
import { useState } from 'react';

import { DesignSystemPreview } from '@/components/design-system-preview';
import { Section } from '@/design-system';

import { PoolBallRackView } from '../../modules/pool-table';

export default function DesignSystemScreen() {
  const [query, setQuery] = useState('');
  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search components',
            hideWhenScrolling: false,
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(''),
          },
        }}
      />
      <DesignSystemPreview query={query}>
        <Section title="Tournament Black" caption="Native SwiftUI renderer, 16 balls.">
          <PoolBallRackView style={{ height: 100 }} />
        </Section>
      </DesignSystemPreview>
    </>
  );
}
