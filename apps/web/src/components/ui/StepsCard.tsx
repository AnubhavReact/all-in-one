import s from "./Cards.module.css";

export function StepsCard({
  title = "How it works",
  steps,
}: {
  title?: string;
  steps: { title: string; body: string }[];
}) {
  return (
    <section className={s.panel} aria-label={title}>
      <h3>{title}</h3>
      <ol className={s.steps}>
        {steps.map((step, i) => (
          <li key={step.title}>
            <span className={s.n} aria-hidden>
              {i + 1}
            </span>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
