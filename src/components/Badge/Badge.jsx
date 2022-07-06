import "./Badge.scss";

const Badge = ({text, color, bgColor}) => {
    return (
        <span className="custom-badge" style={{ backgroundColor: bgColor }}>
            <span className="custom-badge__dot" style={{ backgroundColor: color }}></span>{text}
        </span>
    );
}

export default Badge;