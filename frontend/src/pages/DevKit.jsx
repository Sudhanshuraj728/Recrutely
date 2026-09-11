import { useState } from 'react';
import {
  Home,
  User,
  Settings,
  Search,
  Plus,
  Sparkles,
  MoreVertical,
  Download,
  Briefcase,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Card,
  Badge,
  Input,
  Select,
  Textarea,
  Field,
  Tooltip,
  Modal,
  ModalHeader,
  ModalFooter,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Tabs,
  useToast,
  Progress,
  Skeleton,
  Avatar,
  EmptyState,
  ErrorState,
  PageHeader,
  SectionHeader,
} from '../components/ui';
import { PageTransition } from '../components/motion/PageTransition';
import { Stagger, StaggerItem } from '../components/motion';

/**
 * DevKit — development canvas for the CareerCraft design system.
 *
 * NOT a production page. This is the visual verification surface for the
 * reusable UI primitives and motion system. Production pages are built
 * separately in future phases.
 */
export default function DevKit() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [input, setInput] = useState('');

  return (
    <PageTransition>
      <div className="container py-10 md:py-16">
        <PageHeader
          eyebrow="Design System"
          title="CareerCraft UI Primitives"
          description="The reusable foundation for the premium interface. Every component is responsive, accessible, and motion-aware."
          actions={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  toast({ title: 'Request complete', message: 'This is a success toast.', variant: 'success' })
                }
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Demo toast
              </Button>
              <Button onClick={() => setModalOpen(true)}>Open dialog</Button>
            </div>
          }
        />

        {/* Buttons */}
        <SectionHeader title="Buttons" className="mt-10" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Large
          </Button>
          <Tooltip label="Icon buttons need labels">
            <IconButton label="Search">
              <Search />
            </IconButton>
          </Tooltip>
        </div>

        {/* Cards & badges */}
        <SectionHeader title="Cards & badges" className="mt-12" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary">Premium</Badge>
              <Badge variant="success" dot>Active</Badge>
            </div>
            <h3 className="text-h3">AI-Powered Analysis</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Intelligent, instant feedback on your resume targeting the right companies.
            </p>
          </Card>
          <Card interactive className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="warning">In review</Badge>
              <Badge variant="neutral">14d</Badge>
            </div>
            <h3 className="text-h3">Company-Specific Tips</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Hover to reveal the interactive response. This card is clickable.
            </p>
          </Card>
          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="danger">Action needed</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <h3 className="text-h3">LinkedIn Integration</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Connect professionals and expand your network effortlessly.
            </p>
          </Card>
        </div>

        {/* Form controls */}
        <SectionHeader title="Form controls" className="mt-12" />
        <Card className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="ff-name" required>
            <Input
              id="ff-name"
              placeholder="Jane Doe"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              invalid={input.length === 1}
            />
          </Field>
          <Field label="Email" htmlFor="ff-email" type="text" required>
            <Input id="ff-email" type="email" placeholder="you@example.com" />
          </Field>
          <Field label="Target role" htmlFor="ff-role" description="Shown on your job board profile.">
            <Select id="ff-role" defaultValue="data">
              <option value="data">Data Analyst</option>
              <option value="dev">Software Developer</option>
              <option value="design">Designer</option>
            </Select>
          </Field>
          <Field label="Notes" htmlFor="ff-notes" error="This field cannot be empty.">
            <Textarea id="ff-notes" placeholder="Add any additional context…" invalid />
          </Field>
        </Card>

        {/* Dropdown */}
        <SectionHeader title="Dropdown menu" className="mt-12" />
        <div className="mt-4">
          <Dropdown
            label="Account actions"
            trigger={({ open, toggle }) => (
              <Button variant="secondary" onClick={() => toggle()}>
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
                Menu {open ? '▴' : '▾'}
              </Button>
            )}
          >
            {(close) => (
              <>
                <DropdownItem onSelect={close}>
                  <User className="h-4 w-4" aria-hidden="true" /> Profile
                </DropdownItem>
                <DropdownItem onSelect={close}>
                  <Settings className="h-4 w-4" aria-hidden="true" /> Settings
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem onSelect={close}>
                  <Download className="h-4 w-4" aria-hidden="true" /> Export
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>

        {/* Tabs */}
        <SectionHeader title="Tabs" className="mt-12" />
        <Card className="mt-4 p-4">
          <Tabs
            items={[
              {
                key: 'overview',
                label: 'Overview',
                content: (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Overview tab content. Tabs use arrow-key navigation and a subtle animated indicator.
                  </p>
                ),
              },
              {
                key: 'insights',
                label: 'Insights',
                content: (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Insights tab content with a different panel. The indicator animates between tabs.
                  </p>
                ),
              },
              {
                key: 'activity',
                label: 'Activity',
                content: (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Activity tab content. Accessible via Home/End and arrow keys.
                  </p>
                ),
              },
            ]}
          />
        </Card>

        {/* Progress, avatars, skeleton */}
        <SectionHeader title="Progress, avatars, skeleton" className="mt-12" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-4">
            <p className="text-sm font-medium">Resume score</p>
            <Progress value={82} label="Resume score" />
            <Progress value={45} label="Secondary" size="sm" />
            <Progress label="Loading…" size="sm" />
          </Card>
          <Card className="space-y-3">
            <p className="text-sm font-medium">Team</p>
            <div className="flex gap-2">
              <Avatar name="Jane Doe" />
              <Avatar name="Alex Kim" src="" />
              <Avatar name="Sam Lee" size="lg" />
              <Avatar size="xl" />
            </div>
          </Card>
          <Card className="space-y-3">
            <p className="text-sm font-medium">Loading skeleton</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-24 w-full" />
            </div>
          </Card>
        </div>

        {/* Empty / error states */}
        <SectionHeader title="Empty & error states" className="mt-12" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <EmptyState
            icon={<Briefcase className="h-7 w-7" aria-hidden="true" />}
            title="No saved companies yet"
            description="Companies you save will appear here so you can track your application progress."
            action={<Button size="sm" variant="secondary">Browse companies</Button>}
          />
          <ErrorState onRetry={() => {}} />
        </div>

        {/* Stagger demo */}
        <SectionHeader title="Entrance motion (staggered cards)" className="mt-12" />
        <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Resume', 'Jobs', 'Network', 'Templates'].map((label, i) => (
            <StaggerItem key={label}>
              <Card interactive className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary-sink)] text-[var(--color-primary)]">
                  <Home className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-[var(--color-text-subtle)]">Item {i + 1}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upgrade to Premium" size="md">
          <ModalHeader title="Confirm your plan" description="You're one step away from premium features." />
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Modal dialogs trap focus, support the Escape key, and restore keyboard focus on close.
            </p>
            <Field label="Billing cycle" htmlFor="ff-billing">
              <Select id="ff-billing" defaultValue="month">
                <option value="month">Monthly — ₹149</option>
                <option value="year">Annual — ₹1,490</option>
              </Select>
            </Field>
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm upgrade</Button>
          </ModalFooter>
        </Modal>
      </div>
    </PageTransition>
  );
}
