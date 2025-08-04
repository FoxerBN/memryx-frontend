// UsernameInput.tsx
import { BsPersonCircle } from "react-icons/bs";

type Props = {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
};

export default function UsernameInput({ value, onChange, autoFocus }: Props) {
  return (
    <>
      <label className="input validator">
        <BsPersonCircle className="h-[1em] opacity-50" />
        <input
          autoFocus={autoFocus}
          type="text"
          required
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9]{2,29}"
          minLength={3}
          maxLength={30}
          title="3–30 chars. Letters or numbers, must start with a letter."
          autoComplete="username"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
      <p className="validator-hint text-xs">
        3 – 30 characters, letters & numbers only
      </p>
    </>
  );
}
