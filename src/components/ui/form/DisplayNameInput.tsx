// DisplayNameInput.tsx
import { BsCardText } from "react-icons/bs";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function DisplayNameInput({ value, onChange }: Props) {
  return (
    <>
      <label className="input validator">
        <BsCardText className="h-[1em] opacity-50" />
        <input
          type="text"
          required
          placeholder="Display name"
          pattern="[A-Za-z][A-Za-z0-9]{2,29}"
          minLength={3}
          maxLength={30}
          title="3–30 chars. Letters or numbers."
          autoComplete="nickname"
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
