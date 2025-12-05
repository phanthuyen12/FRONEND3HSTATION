
const CounterCard = ({number,content}) => {
    return (
        <div className="col-lg-6 col-md-6">
        <div className="about-counter">
            <div className="counter-title">
                <h1 className="counter">{number}</h1>
                <h1>%</h1>
            </div>
            <div className="counter-text">
                <span>{content}</span>
            </div>
        </div>
    </div>
    );
};

export default CounterCard;