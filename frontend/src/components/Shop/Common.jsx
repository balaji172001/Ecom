export const StarRating = ({ rating }) => (
    <span className="idx-style-2">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span className="idx-style-3">({rating})</span>
    </span>
);

export function SectionTitle({ icon, title, sub }) {
    return (
        <div className="idx-style-4">
            <div className="idx-style-5">{icon}</div>
            <h2 className="idx-style-6">{title}</h2>
            {sub && <p className="idx-style-7">{sub}</p>}
        </div>
    );
}
