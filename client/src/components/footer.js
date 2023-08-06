import React from 'react'

function Footer({ loadMoreHandler, nextCursor }) {
    return (
        <div className='footer'>
            {nextCursor && <button onClick={loadMoreHandler}>Load More</button>}
        </div>
    )
}

export default Footer;