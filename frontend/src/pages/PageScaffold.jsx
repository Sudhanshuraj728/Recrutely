import { PageTransition } from '../components/motion/PageTransition';
import { PageHeader } from '../components/ui';

export default function PageScaffold({ eyebrow, title, description, actions = null }) {
  return (
    <PageTransition>
      <div className="container py-16">
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      </div>
    </PageTransition>
  );
}
