import React from 'react'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Public = () => {
    const content =(
        <section>
            <header>
            <Typography variant='h1'>WelCome to technotes!</Typography>
            </header>
        <main>
            <Typography variant='h3'> Located in beautiful place to tech repair needs.</Typography>
        </main>
        <footer>
            <Link  to="/login">Employee login</Link>
        </footer>
        </section>
    )
    return content;
}

export default Public