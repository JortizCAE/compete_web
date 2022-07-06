import './Input.scss';

const Input = ({ type, placeholder, style, className, id, required, size, maxlength, onChange, min, max, value }) => {
    return (
        <input className={`input ${className}`} id={id} type={type} placeholder={placeholder} style={style} size={size} maxlength={maxlength} onChange={onChange} min={min} max={max} value={value} required={required}/>
    );
}

export default Input;