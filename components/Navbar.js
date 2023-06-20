import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='h-14 p-2 flex items-center justify-center bg-poke-red '>
        <Link href="/">
            
                <img src="/logo.webp" alt=" " height={36} width={124}/>
            
        </Link>
    </div>
  )
}

export default Navbar