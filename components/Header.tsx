import React from 'react'
import Container from './Container'
import Logo from './Logo'
import HeaderMenu from './HeaderMenu'


const Header = () => {
  return (
    <header className='bg-white py-5 border-b border-b-black/50 ' >

    <Container className=' flex items-center justify-between  bg-white py-5  ' >
        <Logo/>
        <HeaderMenu />
    </Container>


    </header>
  )
}

export default Header