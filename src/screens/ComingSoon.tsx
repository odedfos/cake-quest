type Props = {
  title: string;
  onBack: () => void;
};

export function ComingSoon({ title, onBack }: Props) {
  return (
    <main class="screen coming-soon">
      <h1>{title}</h1>
      <p>Coming soon!</p>
      <button type="button" class="btn btn--play" onClick={onBack}>
        Back
      </button>
    </main>
  );
}
