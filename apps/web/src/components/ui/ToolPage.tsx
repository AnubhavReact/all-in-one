import type { TileHue } from "@aio/core";
import { Icon } from "@/components/ui/Icon";
import { PageHead } from "@/components/ui/PageHead";

/**
 * The shell every tool page shares.
 *
 * The work itself stays in a readable column. The space the sidebar leaves
 * on the right explains the tool in three steps — not a list of the other
 * tools, which is what the sidebar already is.
 */
export function ToolPage({
  hue,
  icon,
  section,
  sectionHref,
  title,
  blurb,
  steps,
  children,
}: {
  hue: TileHue;
  icon: string;
  section: string;
  sectionHref: string;
  title: string;
  blurb: string;
  /** Three short steps: what happens, in order. */
  steps: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <div className="aio-page">
      <PageHead
        icon={icon}
        hue={hue}
        title={title}
        blurb={blurb}
        back={{ label: section, href: sectionHref }}
      />

      <div className="aio-p-work">
        <div className="aio-p-stack">{children}</div>

        <aside className="aio-p-aside">
          <div className="aio-p-asidecard">
            <h3>
              <Icon name="sliders" />
              How it works
            </h3>
            <ol className="aio-p-steps">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="aio-p-asidecard">
            <h3>
              <Icon name="shield" />
              Nothing is uploaded
            </h3>
            <p>
              This runs in the tab, on your machine. The file never reaches a
              server, so there is no copy to delete afterwards and it works
              with the wifi off.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
