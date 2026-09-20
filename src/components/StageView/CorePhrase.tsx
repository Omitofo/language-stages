interface Props {
  phrase: string;
  romanization?: string | null;
}

export default function CorePhrase({ phrase, romanization }: Props) {
  return (
    <div className="text-center space-y-1">
      <div className="text-lg md:text-xl font-medium tracking-tight">
        {phrase}
      </div>
      {romanization && (
        <div className="text-sm text-[rgb(var(--muted))] font-mono">
          {romanization}
        </div>
      )}
    </div>
  );
}
