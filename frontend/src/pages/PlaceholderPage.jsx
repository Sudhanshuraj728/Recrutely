import { PageTransition } from '../components/motion/PageTransition';
import { PageHeader } from '../components/ui';

/**
 * Placeholder route.
 *
 * Routing foundation only. Per the current phase, production pages are NOT
 * redesigned yet — each route is a minimal, data-agnostic stub that will be
 * built out in a later phase.
 */
export default function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <PageTransition>
      <div className="container py-16">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
      </div>
    </PageTransition>
  );
}
