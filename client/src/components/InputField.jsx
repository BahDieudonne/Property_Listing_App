import { useState } from 'react';

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// icon     — optional left-side SVG element
// type     — when "password", adds eye toggle automatically
const InputField = ({ label, error, type, icon, ...props }) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  const classes = [
    'input-field',
    error      ? 'input-error'    : '',
    icon       ? 'input-field--pl' : '',
    isPassword ? 'input-field--pr' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}

      <div className="input-wrap">
        {icon && <span className="input-left-icon">{icon}</span>}

        <input
          type={isPassword ? (visible ? 'text' : 'password') : type}
          className={classes}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input-eye-btn"
            onClick={() => setVisible(v => !v)}
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOpen /> : <EyeClosed />}
          </button>
        )}
      </div>

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default InputField;
