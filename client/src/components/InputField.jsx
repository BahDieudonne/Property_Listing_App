const InputField = ({ label, type = 'text', name, value, onChange, placeholder = '', error }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="input-field"
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default InputField;
