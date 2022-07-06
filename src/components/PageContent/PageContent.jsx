import './PageContent.scss';

const PageContent = ({children}) => {
    return (
        <div className="page-content">
            {children}
        </div>
    );
}

export default PageContent;