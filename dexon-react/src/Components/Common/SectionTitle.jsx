import parse from 'html-react-parser';

const SectionTitle = ({Title,Content=''}) => {
    return (
        <div>
            <h1>{parse(Title)}</h1>
            <p>{parse(Content)}</p>  
        </div>
    );
};

export default SectionTitle;