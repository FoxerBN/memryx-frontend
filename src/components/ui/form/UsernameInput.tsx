import type { UsernameInputProps } from '@/type/localstorage/authInputProps';
import { BsPersonCircle } from "react-icons/bs";


export default function UsernameInput({ value, onChange, autoFocus }: UsernameInputProps) {
  return (
    <>
      <label className="input validator">
        <BsPersonCircle className="h-[1em] opacity-50" />
        <input
          autoFocus={autoFocus}
          type="text"
          required
          placeholder="Username"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}"
          minLength={3}
          maxLength={30}
          title="Must be more than 5 characters, including number, lowercase letter, uppercase letter"
          autoComplete="username"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
      <p className="validator-hint py-2 text-xs">
        Must be more than 5 characters, including number, lowercase letter, uppercase letter
      </p>
    </>
  );
}