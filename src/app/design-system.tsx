import { DesignSystemPreview } from '@/components/design-system-preview';
import { Section } from '@/design-system';

import { PoolBallRackView } from '../../modules/pool-table';

export default function DesignSystemScreen() {
  return (
    <DesignSystemPreview>
      <Section title="Tournament Black" caption="Native SwiftUI renderer, 16 balls.">
        <PoolBallRackView style={{ height: 100 }} />
      </Section>
    </DesignSystemPreview>
  );
}
