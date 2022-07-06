import "./Button.scss";

const Button = ({ text, fn, type, style, icon, button_type }) => {
    return (
        <button className={`button button--${type}`} style={style} type={button_type} onClick={fn}>{icon} {text}</button>
    );
}

export default Button;