import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

/**
 * Section — consistent landing section wrapper: container, optional eyebrow,
 * heading, description, and children. `align` controls text alignment.
 */
export function Section({
  eyebrow,
  title,
  description,
  children,
  align = 'center',
  className,
  id,
  spacious = false,
}) {
  return (
    <section
      id={id}
      className={cn(
        spacious ? 'py-32 sm:py-52' : 'py-28 sm:py-40',
        className
      )}
    >
      <div className="container">
        <Reveal>
          <header
            className={cn(
              'mx-auto mb-16 max-w-3xl',
              align === 'center' ? 'text-center' : 'text-left sm:mx-0'
            )}
          >
            {eyebrow && (
              <p className={cn('eyebrow', align === 'center' && 'mb-3 justify-center')}>
                {eyebrow}
              </p>
            )}
            <h2 className="mt-4 text-h2 text-[var(--color-text)]">{title}</h2>
            {description && (
              <p className="mt-5 text-lg leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                {description}
              </p>
            )}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
