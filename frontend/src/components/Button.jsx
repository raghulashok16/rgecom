function Button({ label, onClick, type = "button", className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
